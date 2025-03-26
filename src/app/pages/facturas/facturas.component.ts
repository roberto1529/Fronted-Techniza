import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FacturasService } from './services/facturas.service';
import { ClientesFact, DetalleFact, EstadoFact, FormatoDto } from './types/dto.interface';
import { PopoverModule } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-facturas',
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
    templateUrl: './facturas.component.html',
    styleUrl: './facturas.component.scss',
    providers: [MessageService]
})
export class FacturasComponent {
    datos!: FormatoDto[];
    detallefact!: DetalleFact[];
    productos_list!: DetalleFact[];
    Cleintes!: ClientesFact[];
    estados!: EstadoFact[];
    empleadoInfo: any = localStorage.getItem('token');
    loading: boolean = true;
    visible: boolean = false;
    @ViewChild('dt2') dt2!: Table; // Definir la referencia correctamente
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
        private crypto: EncryptionService
    ) {}

    // Declaracion de formulario reactivo
    form = this.formBuilder.group({
        id: [''],
        buscar: [''],
        cliente: ['', [Validators.required]],
        productos: this.formBuilder.array([]),
        subtotal: [0],
        iva: [0],
        total: [0],
        idempleado: [''],
        estado: [false]
    });

    ngOnInit(): void {
        this.getData();
        this.empleadoInfo = this.crypto.decryptData(this.empleadoInfo);
        this.empleadoInfo = this.empleadoInfo?.data.data.datos[0];
    }

    private getData() {
        this.serve.getAll().subscribe((res: any) => {
            let response = this.crypto.decryptData(res);
            if (response.status === 200) {
                this.datos = response.data.datos;
                this.Cleintes = response.data.clientes;
                this.estados = response.data.estados;
                this.productos_list = response.data.productos;
                this.loading = false;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error del sistema', detail: 'No se puede establecer conexión con la base de datos...!' });
            }
        });
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
        // Se asume que el formato es: HH:mm:ss.SSSSSS-OF
        // Necesitamos extraer HH:mm:ss, los primeros 3 dígitos de milisegundos y el offset.
        const regex = /^(\d{2}:\d{2}:\d{2})\.(\d{3})\d*(-\d{2})$/;
        const match = fechaStr.match(regex);

        if (match) {
            const timePart = match[1]; // Ej: "21:21:18"
            const millis = match[2]; // Ej: "137"
            const offsetHour = match[3]; // Ej: "-05"
            // Se asume que el offset es en horas y se fija minutos en "00"
            const isoString = `1970-01-01T${timePart}.${millis}${offsetHour}:00`;
            return new Date(isoString);
        }

        return null;
    }

    getProductosDisponibles(index: number): DetalleFact[] {
        // Obtiene los IDs de productos ya seleccionados
        const productosSeleccionados = this.productos.controls.map((control) => control.get('producto')?.value);

        // Filtra la lista excluyendo los productos ya seleccionados, excepto el del índice actual
        return this.productos_list.filter((producto) => !productosSeleccionados.includes(producto.id) || producto.id === this.productos.at(index).get('producto')?.value);
    }

    formModal(titulo: string, data?: any): void {
        this.TituloForm = titulo;
        this.visible = !this.visible;
        if (titulo === 'Editar factura') {
            setTimeout(() => {
                // this.form.patchValue({
                //   id: data?.id,
                //   nombre: data.nombre,
                //   telefono: data.telefono,
                //   correo: data.correo,
                //   ciudad: data.id_ciudad,
                //   pais: data?.id_pais,
                //   empresa: data.empresa,
                //   direccion: data.direccion,
                //   rfc: data.rfc,
                //   codpostal: data.codigo_postal
                // });
            }, 0);
        } else {
            this.form.reset(); // Reinicia los valores del formulario

            // Vaciar el FormArray de productos
            while (this.productos.length !== 0) {
                this.productos.removeAt(0);
            }
        }
    }

    public onCrear(): void {
        console.log(this.form.value);

        this.serve.Setdara(this.form.value).subscribe((res) => {
          let response = this.crypto.decryptData(res);
          if (response.Status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
            this.visible = false;
            this.form.reset();
            this.getData();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
          }
        });
    }

    public onEditar(): void {
        console.log(this.form.value);

        // this.serve.PutUser(this.form.value).subscribe((res) => {
        //   let response = this.crypto.decryptData(res);
        //   if (response.Status === 200) {
        //     this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
        //     this.visible = false;
        //     this.form.reset();
        //     this.getData();
        //   } else {
        //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
        //   }
        // });
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
        // this.serve.SetEstado(datos).subscribe((res: any) => {
        //   let response = this.crypto.decryptData(res);
        //   if (response.status === 200) {
        //     this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
        //     this.visible = false;
        //     this.form.reset();
        //     this.getData();
        //   } else {
        //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
        //   }
        // });
    }

    public async DetalleFactura(id: number) {
        this.detallefact = [];
        let transform = { id: id };
        await this.serve.GetUser(transform).subscribe((res) => {
            let response = this.crypto.decryptData(res);
            this.detallefact = response.data.datos;
        });
    }

    // Obtiene el FormArray de productos
    get productos(): FormArray {
        return this.form.get('productos') as FormArray;
    }

    // Método para agregar un nuevo producto
    public agregarProducto() {
        const productoForm = this.formBuilder.group({
            producto: ['', Validators.required],
            cantidad: [null, [Validators.required, Validators.min(1)]],
            subtotalItem: ['']
        });

        this.productos.push(productoForm);
    }

    // Método para eliminar un producto por índice
    public eliminarProducto(index: number) {
        this.productos.removeAt(index);
    }

    // Método para actualizar un producto en una posición exacta
    public actualizarProducto(index: number) {
        if (this.productos.length > index) {
            let cant = this.productos.at(index).get('cantidad')?.value;
            let precioId = this.productos.at(index).get('producto')?.value;

            // Buscar el producto en la lista
            let productoEncontrado: any = this.productos_list.find((x) => x.id === precioId);
            console.log(cant, Number(productoEncontrado.precio));
            let subTotal = cant * Number(productoEncontrado.precio);
            this.productos.at(index).patchValue({
                subtotalItem: subTotal
            });

            this.form.patchValue({
                subtotal: this.subtotal,
                iva: this.iva,
                total: this.total
            });

            console.log('totales', this.productos.value);
        } else {
            console.log('Índice fuera de rango');
        }
    }
    // Función para obtener el subtotal con máximo 2 decimales
    get subtotal(): number {
        const total = this.productos.controls.reduce((acc, producto) => {
            const subtotal = producto.get('subtotalItem')?.value || 0;
            return acc + subtotal;
        }, 0);
        return parseFloat(total.toFixed(2)); // Redondea a 2 decimales
    }

    // Función para calcular el IVA (16%) con 2 decimales
    get iva(): number {
        return parseFloat((this.subtotal * 0.16).toFixed(2));
    }

    // Función para calcular el total (subtotal + IVA) con 2 decimales
    get total(): number {
        return parseFloat((this.subtotal + this.iva).toFixed(2));
    }
}
