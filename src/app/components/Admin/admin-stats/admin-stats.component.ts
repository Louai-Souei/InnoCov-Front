import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import {UserService} from "../../../services/user/user.service";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  occupation: string;
  status: boolean; // Ajout du statut
}

interface Complaint {
  id: number;
  description: string;
  createdAt: Date;
  complainer: User;
  targetUser: User;
  resolved: boolean;
}

interface ComplaintsGroupedByTargetUser {
  targetUser: User;
  complaints: Complaint[];
  count: number;
  expanded?: boolean; // Optionnel pour gérer l'état de développement
}

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.css'],
})
export class AdminStatsComponent implements OnInit {
  users: User[] = []; // Liste des utilisateurs
  loading: boolean = true; // État de chargement
  complaints: Complaint[] = []; // Liste des plaintes
  complaintsGroupedByTargetUser: ComplaintsGroupedByTargetUser[] = []; // Plaintes groupées par targetUser
  selectedComplaints: Complaint[] = []; // Plaintes sélectionnées pour le dialogue
  visible: boolean = false; // Contrôle la visibilité du dialogue

  @ViewChild('dt1') dt1!: Table; // Référence à la table

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.fetchUsers(); // Charger les utilisateurs
    this.fetchComplaints(); // Charger les plaintes
  }

  // Méthode pour récupérer les utilisateurs
  fetchUsers() {
    this.http.get<User[]>('http://localhost:8081/api/users/getAll').subscribe(
      (data) => {
        this.users = data;
        this.loading = false;
        console.log('Fetched users:', this.users); // Log les utilisateurs
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    );
  }

  // Méthode pour récupérer les plaintes
  fetchComplaints() {
    this.http.get<Complaint[]>('http://localhost:8081/api/complaint/complaints-grouped-by-target-user').subscribe(
      (data) => {
        this.complaints = data;
        this.loading = false;

        // Grouper les plaintes par targetUser
        this.complaintsGroupedByTargetUser = this.groupComplaintsByTargetUser(data);

        console.log('Fetched complaints:', this.complaints); // Log les plaintes
        console.log('Complaints grouped by targetUser:', this.complaintsGroupedByTargetUser); // Log les plaintes groupées
      },
      (error) => {
        console.error('Error fetching complaints:', error);
        this.loading = false;
        alert('Failed to fetch complaints. Please check if the backend is running.');
      }
    );
  }

  // Méthode pour grouper les plaintes par targetUser
  groupComplaintsByTargetUser(complaints: Complaint[]): ComplaintsGroupedByTargetUser[] {
    const groupedMap = new Map<number, { targetUser: User, complaints: Complaint[] }>();

    complaints.forEach(complaint => {
      const targetUserId = complaint.targetUser.id;

      if (!groupedMap.has(targetUserId)) {
        groupedMap.set(targetUserId, { targetUser: complaint.targetUser, complaints: [] });
      }

      groupedMap.get(targetUserId)!.complaints.push(complaint);
    });

    // Convertir la Map en tableau et ajouter le nombre de plaintes
    return Array.from(groupedMap.values()).map(group => ({
      targetUser: group.targetUser,
      complaints: group.complaints,
      count: group.complaints.length,
      expanded: false // Initialiser expanded à false
    }));
  }

  // Méthode pour basculer l'état de développement d'une ligne
  toggleRow(group: ComplaintsGroupedByTargetUser) {
    group.expanded = !group.expanded; // Inverse l'état de développement
  }



  // Méthode pour afficher les détails des plaintes dans un dialogue
  showComplaintsDetails(complaints: Complaint[]) {
    this.selectedComplaints = complaints;
    this.visible = true;
  }

  // Méthode pour fermer le dialogue
  closeDialog() {
    this.visible = false;
    this.selectedComplaints = [];
  }

  toggleUserStatus(user: User) {
    if (user.status) {
      // Si l'utilisateur est actif, le désactiver
      this.userService.deactivateUser(user.id).subscribe(
        (updatedUser) => {
          this.fetchUsers(); // Charger les utilisateurs
          this.fetchComplaints(); // Charger les plaintes
          console.log('Utilisateur désactivé:', updatedUser);
        },
        (error) => {
          console.error('Erreur lors de la désactivation de l\'utilisateur:', error);
        }
      );
    } else {
      // Si l'utilisateur est inactif, l'activer
      this.userService.activateUser(user.id).subscribe(
        (updatedUser) => {
          this.fetchUsers(); // Charger les utilisateurs
          this.fetchComplaints(); // Charger les plaintes
          console.log('Utilisateur activé:', updatedUser);
        },
        (error) => {
          console.error('Erreur lors de l\'activation de l\'utilisateur:', error);
        }
      );
    }
  }

}
