import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'primeng/table';
import { UserService } from "../../../services/user/user.service";
import Swal from 'sweetalert2';
import {AlertService} from "../../../services/utils/alert/alert.service";

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

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private alertService: AlertService // Injection du service d'alertes
  ) {}

  ngOnInit() {
    this.fetchUsers(); // Charger les utilisateurs
    this.fetchComplaints(); // Charger les plaintes
  }

  // Méthode pour récupérer les utilisateurs
  fetchUsers() {
    this.http.get<User[]>('http://localhost:8081/api/user/getAll').subscribe(
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
    this.http.get<Complaint[]>('http://localhost:8081/api/complaint/all-complaints').subscribe(
      (data) => {
        console.log(data);
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
        this.alertService.error('Failed to fetch complaints. Please check if the backend is running.');  // Utilisation d'alerte en cas d'erreur
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

    // Convertir la Map en tableau, ajouter le nombre de plaintes et trier par count
    return Array.from(groupedMap.values())
      .map(group => ({
        targetUser: group.targetUser,
        complaints: group.complaints,
        count: group.complaints.length,
        expanded: false // Initialiser expanded à false
      }))
      .sort((a, b) => b.count - a.count); // Trier par count (décroissant)
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
    // Afficher la confirmation de blocage/déblocage avec SweetAlert2
    Swal.fire({
      title: user.status ? 'Are you sure you want to deactivate this user?' : 'Are you sure you want to activate this user?',
      text: 'This action will ' + (user.status ? 'deactivate' : 'activate') + ' the user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: user.status ? 'Yes, deactivate it!' : 'Yes, activate it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (user.status) {
          // Si l'utilisateur est actif, le désactiver
          this.userService.deactivateUser(user.id).subscribe(
            (updatedUser) => {
              this.fetchUsers(); // Recharger les utilisateurs
              this.alertService.success('User has been deactivated successfully!');
              console.log('Utilisateur désactivé:', updatedUser);
            },
            (error) => {
              console.error('Erreur lors de la désactivation de l\'utilisateur:', error);
              this.alertService.error('Failed to deactivate user.');
            }
          );
        } else {
          // Si l'utilisateur est inactif, l'activer
          this.userService.activateUser(user.id).subscribe(
            (updatedUser) => {
              this.fetchUsers(); // Recharger les utilisateurs
              this.alertService.success('User has been activated successfully!');
              console.log('Utilisateur activé:', updatedUser);
            },
            (error) => {
              console.error('Erreur lors de l\'activation de l\'utilisateur:', error);
              this.alertService.error('Failed to activate user.');
            }
          );
        }
      }
    });
  }
}
