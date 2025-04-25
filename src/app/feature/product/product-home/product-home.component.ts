import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SaveProductDlgComponent } from '../save-product-dlg/save-product-dlg.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.scss'
})
export class ProductHomeComponent implements OnInit {
  columns: string[] = ['image', 'name', 'description', 'currency', 'price', 'action']; // Quitamos la columna de 'state'
  dataSource: Product[] = [];
  originalData: Product[] = [];

  nameFilter: string = '';
  currencyFilter: string = ''; // Filtro por moneda

  productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.productService.getAll().subscribe(res => {
      this.originalData = res.data;
      this.dataSource = [...res.data];
    });
  }

  applyFilters(): void {
    this.dataSource = this.originalData.filter(product => {
      const matchName = product.name.toLowerCase().includes(this.nameFilter.toLowerCase());

      // Filtro por moneda
      const matchCurrency = this.currencyFilter !== ''
        ? product.currencyCode === this.currencyFilter
        : true;

      return matchName && matchCurrency;
    });
  }

  openProductDlg(product?: Product): void {
    const dialogRef = this.dialog.open(SaveProductDlgComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.getAll();
    });
  }

  inactiveProduct(id: number): void {
    this.productService.inactive(id).subscribe(res => {
      if (res.status) {
        this.getAll();
        this.snackbar.open('Se inactivó el producto', 'Aceptar', { duration: 3000 });
      }
    });
  }
}
