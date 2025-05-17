import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { EncryptionService } from '../../shared/encryption.interceptor';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-topbar',
    standalone: true,
    templateUrl: './app.topbar.html',
    styleUrl: './app.scss',
    imports: [RouterModule,ConfirmPopupModule, ButtonModule, ToastModule,CommonModule, StyleClassModule, AppConfigurator, AvatarModule, AvatarGroupModule],
    providers: [ConfirmationService, MessageService]
})
export class AppTopbar {
    items!: MenuItem[];
    local = localStorage.getItem('token');
    Data: any;
    alias: any;
    constructor(public layoutService: LayoutService, private crypto: EncryptionService,private confirmationService: ConfirmationService, private messageService: MessageService) {
       const  jsonData = this.crypto.decryptData(this.local);
       this.Data  = jsonData.data.data.datos[0];
       this.alias = this.Data.usuario.substring(0, 2);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    confirm1(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Hola, el usuario desea cerrar sesión.',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Cerrar'
            },
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Sesión cerrada', life: 3000 });
                localStorage.clear();
                setTimeout(() => {
                    window.location.reload();
                }, 4500);
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }
}
