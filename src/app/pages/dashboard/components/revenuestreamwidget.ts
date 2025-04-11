import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { EncryptionService } from '../../../shared/encryption.interceptor';
import { EndpointDash } from '../services/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Ventas Recientes</div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class RevenueStreamWidget {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    constructor(public layoutService: LayoutService, private service: EndpointDash,
        private crypto: EncryptionService) {
        this.initChart();

    }

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.service.getGrafic().subscribe(res =>{
            let data: any = this.crypto.decryptData(res);
            console.log('Grafics',data.data.datos);

                const labels = data.data.datos.map((d:any) => d.cliente);
                const values = data.data.datos.map((d:any)  => d.total_cotizaciones);

                this.chartData = {
                    labels: labels,
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Cotizaciones',
                            backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                            data: values,
                            barThickness: 32
                        }
                    ]
                };

                this.chartOptions = {
                    maintainAspectRatio: false,
                    aspectRatio: 0.8,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: textMutedColor
                            },
                            grid: {
                                color: 'transparent'
                            }
                        },
                        y: {
                            ticks: {
                                color: textMutedColor
                            },
                            grid: {
                                color: borderColor
                            }
                        }
                    }
                };

     });


    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
