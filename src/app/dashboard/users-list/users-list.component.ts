import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { User } from 'src/app/models/user';
import { UsersService } from '../services/users.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'avatar' ,'first_name', 'last_name', 'email', 'delete'];
  dataSource!: MatTableDataSource<User>;
  pageEvent: PageEvent = new PageEvent();
  users: User[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  length: number = 1;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usersService: UsersService, readonly snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUsers(this.pageEvent);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadUsers(event: PageEvent): PageEvent {
    const page: number = event.pageIndex + 1;
    this.usersService.getUsers(page).subscribe({
      next: (response) => {
        this.users = response.data;
        this.pageIndex = response.pageIndex;
        this.pageSize = response.per_page;
        this.length = response.total;
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.sort = this.sort;
      }
    })
    return event;
  }

  deleteUser(event: any, user: User){
    this.usersService.deleteUser(user).subscribe(
      {
        next: () => {
          this.openSnackBar(`Usunięto użytkownika o id ${user.id}`, 'Zamknij');
          this.dataSource.data = this.dataSource.data.filter(e => e.id != user.id);
        } 
      }
    )
  }

  
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  // editUser(event: any, user: User){

  // }
}