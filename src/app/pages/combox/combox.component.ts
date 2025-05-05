import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { EncryptionService } from '../../shared/encryption.interceptor';
import { CustomValidators } from '../../shared/validator/validators';
import { PopoverModule } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { SkeletonModule } from 'primeng/skeleton';
import { FacturasService } from '../facturas/services/facturas.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-machote',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        TagModule,
        IconFieldModule,
        InputTextModule,
        InputIconModule,
        MultiSelectModule,
        SelectModule,
        CommonModule,
        ReactiveFormsModule,
        TagModule,
        ToggleSwitchModule,
        TooltipModule,
        DialogModule,
        ToastModule,
        InputNumberModule,
        PopoverModule,
        BadgeModule,
        OverlayBadgeModule,
        SkeletonModule
    ],
    templateUrl: './combox.component.html',
    styleUrl: './combox.component.scss',
    providers: [MessageService]
})
export class ComboxComponent {
    datos!: any[];
    detallefact!: any[];
    productos_list!: any[];
    Cleintes!: any[];
    estados!: any[];
    empleadoInfo: any = localStorage.getItem('token');
    loading: boolean = true;
    visible: boolean = false;
    @ViewChild('dt2') dt2!: Table;
    private formBuilder = inject(FormBuilder);
    TituloForm: string = '';
    errorMessages: Record<string, string> = {
        required: 'El campo es obligatorio',
        whitespace: 'No se permiten espacios en blanco',
        minlength: 'Mínimo 8 caracteres',
        email: 'El correo no es válido',
        firstLetterUppercase: 'La primera letra debe ser mayúscula',
        uppercaseStart: 'La contraseña debe comenzar con mayúscula',
        requiresNumber: 'Debe contener al menos un número',
        requiresSpecialChar: 'Debe incluir al menos un carácter especial',
        pattern: 'Solo se permiten números'
    };

    constructor(
        private serve: FacturasService,
        private messageService: MessageService,
        private crypto: EncryptionService,
        private _router: Router
    ) { }

    // Declaracion de formulario reactivo
    form = this.formBuilder.group({
        id: [''],
        buscar: [''],
        Nonbre: ['', [
            Validators.required,
            CustomValidators.noWhitespaceValidator,
            CustomValidators.firstLetterUppercase
        ]],
        cliente: ['', [Validators.required]],
        productos: this.formBuilder.array([]),
        idempleado: [''],
        estado: [false]
    });

    ngOnInit(): void {
        this.getData();
        this.empleadoInfo = this.crypto.decryptData(this.empleadoInfo);
        this.empleadoInfo = this.empleadoInfo?.data.data.datos[0];
    }

    private getData() {
        this.serve.getRowmachotes().subscribe((res: any) => {
            let response = this.crypto.decryptData(res);
            if (response.status === 200) {
                this.datos = response.data.datos;
                console.log(this.datos);

                this.Cleintes = response.data.clientes;
                this.estados = response.data.estados;
                this.productos_list = response.data.productos;
                this.loading = false;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error del sistema', detail: 'No se puede establecer conexión con la base de datos...!' });
            }
        });

        // getRowmachotes   //Mochotes services
    }

    clear(table: Table) {
        table.clear();
        this.form.reset();
    }

    searchGlobal(event: Event) {
        const input = event.target as HTMLInputElement;
        this.dt2.filterGlobal(input.value, 'contains');
    }

    getSeverity(status: boolean) {
        switch (status) {
            case true:
                return 'success';
            case false:
                return 'warn';
        }
    }

    getStatusNombre(status: boolean) {
        switch (status) {
            case true:
                return 'Activo';
            case false:
                return 'Inactivo';
        }
    }

    formatFecha(fechaStr: string): Date | null {
        const regex = /^(\d{2}:\d{2}:\d{2})\.(\d{3})\d*(-\d{2})$/;
        const match = fechaStr.match(regex);

        if (match) {
            const timePart = match[1];
            const millis = match[2];
            const offsetHour = match[3];
            const isoString = `1970-01-01T${timePart}.${millis}${offsetHour}:00`;
            return new Date(isoString);
        }

        return null;
    }

    getProductosDisponibles(index: number): any[] {
        const productosSeleccionados = this.productos.controls.map((control) => control.get('producto')?.value);
        return this.productos_list.filter((producto) =>
            !productosSeleccionados.includes(producto.id) ||
            producto.id === this.productos.at(index).get('producto')?.value
        );
    }

    // Método para mostrar el modal de formulario
    formModal(titulo: string, data?: any): void {
        this.TituloForm = titulo;
        this.visible = !this.visible;

        if (titulo === 'Editar plantilla') {
            console.log('Datos de entrada', data);

            setTimeout(() => {
                const send = { id: data.id };
                this.serve.GetdataPlantilla(send).subscribe((res: any) => {
                    let response = this.crypto.decryptData(res);

                    // Limpia el FormArray existente
                    this.productos.clear();

                    // Actualiza los datos principales
                    this.form.patchValue({
                        id: data?.id,
                        Nonbre: data.nombre,
                        cliente: data.id_cliente
                    });

                    // Agrega los productos al FormArray
                    response.data.productos.forEach((producto: any) => {
                        // const productoEncontrado = this.productos_list.find(p => p.id === producto.id_producto);
                        const productoForm = this.formBuilder.group({
                            producto: [producto.id_producto, Validators.required],
                            cantidad: [producto.cantidad, [Validators.required, Validators.min(1)]],
                        });

                        // Configura los listeners para cambios
                        this.configurarListenersDeProducto(productoForm);

                        this.productos.push(productoForm);
                    });
                });
            }, 8);
        } else if (titulo === 'Duplicar factura') {
            console.log('Duplicando factura', data);

            setTimeout(() => {
                const send = { id: data.id };
                this.serve.GetdataProd(send).subscribe((res: any) => {
                    let response = this.crypto.decryptData(res);

                    // Limpia el FormArray existente
                    this.productos.clear();


                    // Agrega los productos al FormArray
                    response.data.datos.forEach((producto: any) => {
                        const productoEncontrado = this.productos_list.find(p => p.id === producto.id_producto);


                        const productoForm = this.formBuilder.group({
                            producto: [producto.id_producto, Validators.required]
                        });

                        // Configura los listeners para cambios
                        this.configurarListenersDeProducto(productoForm);

                        this.productos.push(productoForm);
                    });
                });
            }, 8);
        } else {
            this.resetearFormulario();
        }
    }

    // Método para resetear el formulario
    private resetearFormulario() {
        this.form.reset();
        this.productos.clear();
    }

    // Configura listeners para cambios en cantidad/producto
    private configurarListenersDeProducto(productoForm: FormGroup) {
        productoForm.get('cantidad')?.valueChanges.subscribe(() => {
            const index = this.productos.controls.indexOf(productoForm);
            if (index !== -1) {
                this.actualizarProducto(index);
            }
        });

        productoForm.get('producto')?.valueChanges.subscribe(() => {
            const index = this.productos.controls.indexOf(productoForm);
            if (index !== -1) {
                this.actualizarProducto(index);
            }
        });
    }

    // Método para actualizar un producto y recalcular totales
    public actualizarProducto(index: number) {
        if (this.productos.length > index) {
            const productoForm = this.productos.at(index);
            const cantidad = productoForm.get('cantidad')?.value;
            const productoId = productoForm.get('producto')?.value;

            // Buscar el producto en la lista
            const productoEncontrado = this.productos_list.find(x => x.id === productoId);
        }
    }


    // Método para agregar un nuevo producto
    public agregarProducto() {
        const productoForm = this.formBuilder.group({
            producto: ['', Validators.required],
            cantidad: [null, [Validators.required, Validators.min(1)]],
        });

        // Configura los listeners para cambios
        this.configurarListenersDeProducto(productoForm);

        this.productos.push(productoForm);
    }

    // Método para eliminar un producto por índice
    public eliminarProducto(index: number) {
        this.productos.removeAt(index);
    }

    // Obtiene el FormArray de productos
    get productos(): FormArray {
        return this.form.get('productos') as FormArray;
    }

    public onCrear(): void {
        this.serve.SetdataPlantilla(this.form.value).subscribe((res) => {
            let response = this.crypto.decryptData(res);
            if (response.Status === 200) {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data.msj });
                this.visible = false;
                this.form.reset();
                this.getData();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
            }
        });
    }

    public onEditar(): void {
        console.log('Formulario', this.form.value);
        this.serve.PutDataPlantilla(this.form.value).subscribe((res: any) => {
            let response = this.crypto.decryptData(res);
            if (response.Status === 200) {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data.msj });

                this.visible = false;
                this.form.reset();
                this.getData();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
            }
        })
    }

    public mensajeError(campo: string, error: string): boolean {
        const control = this.form.get(`${campo}`);
        return control! && control.hasError(error) && (control.dirty || control.touched);
    }

    getFieldErrors(field: string): string[] {
        const control = this.form.get(field);
        if (!control || !control.errors || !control.touched) return [];
        return Object.keys(control.errors).map((errorKey) => this.errorMessages[errorKey] || 'Error desconocido');
    }

    getEstadoControl(datos: any): FormControl {
        return new FormControl(datos.estado);
    }

    onEstadoChange(datos: any) {
        datos.estado = !datos.estado;
        // Implementación de cambio de estado aquí
        this.serve.SetEstadoPlantilla(datos).subscribe((res: any) => {
            let response = this.crypto.decryptData(res);
            if (response.status === 200) {
              this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
              this.visible = false;
              this.form.reset();
              this.getData();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
            }
          });

    }

    public async DetalleFactura(id: number) {
        this.detallefact = [];
        let transform = { id: id };
        await this.serve.GetProdPlantilla(transform).subscribe((res) => {
            let response = this.crypto.decryptData(res);
            this.detallefact = response.data.datos;
        });
    }

    public UsarPlantilla(id: number){
        this._router.navigate(['/dash/modulo/facturas/', id]);
    }
}
