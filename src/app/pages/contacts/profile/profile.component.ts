import { Component, OnInit } from "@angular/core";

import { revenueBarChart, statData } from "./data";

import { ChartType } from "./profile.model";
import { AuthenticationService } from "src/app/account/auth/services/auth.service";
import { User } from "src/app/store/Authentication/auth.models";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  user: User;
  breadCrumbItems: Array<{}>;
  revenueBarChart: ChartType;
  statData: any;
  constructor(private authService: AuthenticationService) {
    this.user = this.authService.currentUser();
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Contacts" },
      { label: "Profile", active: true },
    ];

    // fetches the data
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }
}
