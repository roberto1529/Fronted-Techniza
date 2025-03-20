import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { EncryptionService } from '../../shared/encryption.interceptor';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    local = localStorage.getItem('token');
    Data: any;
    model: MenuItem[] = [];
    constructor(private crypto: EncryptionService){
        const  jsonData = this.crypto.decryptData(this.local);
        this.Data  = jsonData.data.data.datos[0];    
        
        if (this.Data.tipo === 1) {
            this.menuAdmin()
        }
    }
    
    
    protected menuAdmin(): void{
        this.model = [
            
            {
                label: 'Inicio',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Administración',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Usuarios',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Empleados',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/dash/modulo/empleados']
                            },
                            {
                                label: 'Clientes',
                                icon: 'pi pi-fw pi-address-book',
                                routerLink: ['/dash/modulo/clientes']
                            },
                        ]
                    },
                    {
                        label: 'Facturas',
                        icon: 'pi pi-file-pdf',
                        routerLink: ['/dash/modulo/facturas']
                    },
                    {
                        label: 'Productos',
                        icon: 'pi pi-box',
                        routerLink: ['/dash/modulo/productos']
                    },
                ]
            }
        ]
    }

}
