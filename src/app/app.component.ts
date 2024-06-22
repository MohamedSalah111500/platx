import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})

export class AppComponent implements OnInit {

  userData = {
    token:
      "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZkZDJmZDRjLTUzM2ItNGU4MC04ZDgxLTA4ZGMyMmFlYTdlYSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InNheWVkMTIzQGdtYWlsLmNvbSIsImV4cCI6MTcwNjc0MjI0OH0.eekIlH2UNFfyUYTEqzugWXQcDkcGqRSWbaF_3Fd0VFU",
    expiryDateTime: "2024-01-31T23:04:08Z",
    userId: "6dd2fd4c-533b-4e80-8d81-08dc22aea7ea",
    userName: "sayed123",
    email: "sayed123@gmail.com",
    firstName: "Mohamed",
    lastName: "Salah",
    isEmailVerified: true,
    roles: [],
  };

  ngOnInit() {
    localStorage.setItem("currentUser", JSON.stringify(this.userData));
  }
}
