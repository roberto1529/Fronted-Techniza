import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { EncryptionService } from '../../shared/encryption.interceptor';

@Component({
    selector: 'app-topbar',
    standalone: true,
    templateUrl: './app.topbar.html',
    styleUrl: './app.scss',
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, AvatarModule, AvatarGroupModule],
})
export class AppTopbar {
    items!: MenuItem[];
    local = localStorage.getItem('token');
    Data: any;
    alias: any;
    constructor(public layoutService: LayoutService, private crypto: EncryptionService) {
       const  jsonData = this.crypto.decryptData(this.local);
       this.Data  = jsonData.data.data.datos[0];
       this.alias = this.Data.usuario.substring(0, 2);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
