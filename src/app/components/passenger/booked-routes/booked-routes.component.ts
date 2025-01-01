import {Component, OnInit} from '@angular/core';
import {Route} from "../../../entity/Route";
import {AlertService} from "../../../services/utils/alert/alert.service";
import {RouteBookingService} from "../../../services/route-booking/route-booking.service";
import {ApiResponse} from "../../../services/utils/models/ApiResponse";
import {User} from "../../../entity/User";
import {ComplaintType} from "../../../entity/enums/ComplaintType";
import {Complaint} from "../../../entity/Complaint";
import {ComplaintService} from "../../../services/complaint/complaint.service";

@Component({
  selector: 'app-booked-routes',
  templateUrl: './booked-routes.component.html',
  styleUrls: ['./booked-routes.component.css']
})
export class BookedRoutesComponent implements OnInit {
  activeUserId!: string | null;
  bookedRoutes: Route[] = [];
  selectedRoute!: Route | null;
  visible: boolean = false;
  loading: boolean = true;
  complaintForm: boolean = false;
  selectedUser!: User | null;
  complaintTypes: { label: string; value: string }[] = [];
  selectedComplaintType!: string;
  complaintDescription!: string;

  constructor(
    private complaintService: ComplaintService,
    private alertService: AlertService,
    private routeBookingService: RouteBookingService
  ) {
  }

  ngOnInit(): void {
    this.routeBookingService.getUserBookedRoutes().subscribe({
      next: (response: ApiResponse<Route[]>) => {
        this.bookedRoutes = response.data;
        this.loading = false;
        this.activeUserId = localStorage.getItem('userId');
      },
      error: () => {
        this.loading = false;
      }
    });
    this.loadComplaintTypes();
  }

  private loadComplaintTypes(): void {
    this.complaintTypes = Object.keys(ComplaintType).map(key => ({
      label: key.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '),
      value: ComplaintType[key as keyof typeof ComplaintType]
    }));
  }

  viewDetails(route: Route) {
    this.selectedRoute = {
      ...route,
      passengers: route.passengers.filter(passenger => passenger.id.toString() !== this.activeUserId)
    };
    this.visible = true;
  }

  submitComplaint(): void {
    if (!this.selectedComplaintType || !this.complaintDescription) {
      this.alertService.error('Please select a complaint type and provide a description.');
      return;
    }

    const newComplaint: Complaint = {
      id: null,
      description: this.complaintDescription,
      createdAt: null,
      complainer: null,
      targetUser: this.selectedUser!,
      complaintType: ComplaintType[this.selectedComplaintType as keyof typeof ComplaintType],
      resolved: null
    };

    this.complaintService.addComplaint(newComplaint).subscribe({
      next: (response: ApiResponse<Complaint>) => {
        this.alertService.success('Complaint submitted successfully');
        this.complaintForm = false;
      },
      error: (error) => {
        this.alertService.error('Error submitting complaint');
      }
    });
    this.closeComplaintForm();
  }

  showComplaintForm(user: User) {
    this.complaintForm = true;
    this.selectedUser = user;
  }

  closeComplaintForm(): void {
    this.complaintForm = false;
    this.selectedComplaintType = '';
    this.complaintDescription = '';
    this.selectedUser = null;
  }
}
