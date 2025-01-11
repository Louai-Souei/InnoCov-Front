import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'primeng/table';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  occupation: string;
}

interface Complaint {
  id: number;
  description: string;
  createdAt: Date;
  complainer: User;
  targetUser: User;
  resolved: boolean;
}

interface ComplaintGroupedByComplainer {
  complainer: User;
  complaints: Complaint[];
  count: number;
  expanded?: boolean; // Propriété optionnelle pour gérer l'état de développement
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
  complaintsGroupedByComplainer: ComplaintGroupedByComplainer[] = []; // Plaintes groupées par complainer

  @ViewChild('dt1') dt1!: Table; // Référence à la table

  constructor(private http: HttpClient) {}

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

        // Grouper les plaintes par complainer
        this.complaintsGroupedByComplainer = this.groupComplaintsByComplainer(data);

        console.log('Fetched complaints:', this.complaints); // Log les plaintes
        console.log('Complaints grouped by complainer:', this.complaintsGroupedByComplainer); // Log les plaintes groupées
      },
      (error) => {
        console.error('Error fetching complaints:', error);
        this.loading = false;
        alert('Failed to fetch complaints. Please check if the backend is running.');
      }
    );
  }

  // Méthode pour grouper les plaintes par complainer
  groupComplaintsByComplainer(complaints: Complaint[]): ComplaintGroupedByComplainer[] {
    const groupedMap = new Map<number, { complainer: User, complaints: Complaint[] }>();

    complaints.forEach(complaint => {
      const complainerId = complaint.complainer.id;

      if (!groupedMap.has(complainerId)) {
        groupedMap.set(complainerId, { complainer: complaint.complainer, complaints: [] });
      }

      groupedMap.get(complainerId)!.complaints.push(complaint);
    });

    // Convertir la Map en tableau et ajouter le nombre de plaintes
    return Array.from(groupedMap.values()).map(group => ({
      complainer: group.complainer,
      complaints: group.complaints,
      count: group.complaints.length,
      expanded: false // Initialiser expanded à false
    }));
  }

  // Méthode pour basculer l'état de développement d'une ligne
  toggleRow(group: ComplaintGroupedByComplainer) {
    group.expanded = !group.expanded; // Inverse l'état de développement
  }

  // Méthode pour effacer les filtres de la table
  clear(table: Table) {
    table.clear();
  }

  // Méthode pour déterminer la sévérité en fonction du rôle
  getSeverity(role: string) {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'success';
      case 'user':
        return 'info';
      default:
        return 'warning';
    }
  }

  // Méthode pour filtrer globalement la table
  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.dt1.filterGlobal(inputElement.value, 'contains');
  }

  // Méthode pour filtrer par date (exemple)
  onFilterDateChange($event: any) {
    this.users = $event;
    this.fetchUsers();
  }

  // Méthode pour effacer les filtres de date
  clearDate() {
    this.users = [];
    this.onFilterDateChange(null);
  }
}
