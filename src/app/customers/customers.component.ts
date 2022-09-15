import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {Customer} from "../model/customer.model";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers! : Observable<Customer[]>;
  errorMessage! : string;
  searchFormGroup: FormGroup | undefined;

  constructor(private customerService: CustomerService,
              private fb: FormBuilder) { }

  ngOnInit(): void {

    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    });

    /*
    this.customers = this.customerService.getCustomers().pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );


     */

    /*
    this.customerService.getCustomers().subscribe({
      next : (data) => {
        this.customers = data;
      },
      error : (err) => {
        this.errorMessage = err.message;
      }
    })
     */

    this.handleSearchCustomers();


  }

  handleSearchCustomers() {

    let kw = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    )


  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm("Are you sure ");
    if (!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next : resp => {
        this.customers = this.customers.pipe(
          map(data => {
            let index = data.indexOf(c);
            data.splice(index,1);
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    })
  }
}
