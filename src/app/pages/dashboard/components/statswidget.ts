import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndpointDash } from '../services/dashboard.service';
import { EncryptionService } from '../../../shared/encryption.interceptor';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Cotizaciones</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{cotizaciones}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-file-check text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{mes}}</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Facturado</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$ {{Totalventas}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{mes}}</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Clientes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{userTotal}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{mes}}</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Productos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{producto}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-box text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{mes}}</span>
            </div>
        </div>`
})
export class StatsWidget  {
    mes?: any;
    cotizaciones?: any;
    Totalventas?: any;
    userTotal?: any;
    producto?: any;
    constructor(private service: EndpointDash, private crypto: EncryptionService){
        this.Getdata()
    }

    private Getdata(){
        this.service.getAll().subscribe(res =>{
            let response = this.crypto.decryptData(res);
            console.log(response);

            const { mes, cotizaciones, total_ventas } = response?.data.ventas[0] || {};
            const { cli } = response?.data.clientes[0] || {};
            const { pro } = response?.data.productos[0] || {};
                this.mes = mes;
                this.cotizaciones = cotizaciones;
                this.Totalventas = total_ventas;
                this.userTotal = cli;
                this.producto = pro;
        })

    }
}
