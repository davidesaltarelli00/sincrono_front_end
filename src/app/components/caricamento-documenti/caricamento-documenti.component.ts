import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import { MenuService } from '../menu.service';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-caricamento-documenti',
  templateUrl: './caricamento-documenti.component.html',
  styleUrls: ['./caricamento-documenti.component.scss'],
})
export class CaricamentoDocumentiComponent implements OnInit {
  //navbar
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  idUtente: any;
  nazioni: string[] = [];
  capitali: any[] = [];
  province: any[] = [];
  dati: any = [];
  statoDiNascita: any;
  provinciaDiNascita: string = '';
  ruolo: any;

  base64Documento: any;
  selectedFileName: string = '';
  previewData: string | undefined;
  token = localStorage.getItem('token');
  mobile: boolean=false;


  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private menuService: MenuService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog
  ) {
    if (window.innerWidth >= 900) {
      // 768px portrait
      this.mobile = false;
    } else {
      this.mobile = true;
    }
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) == true
    ) {
      this.mobile = true;
    }
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFileName = file.name;

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data: ArrayBuffer = e.target.result;
        const base64String: string = this.arrayBufferToBase64(data);
        this.previewExcel(base64String);
        this.base64Documento = base64String;
      };

      reader.readAsArrayBuffer(file);
    }
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  previewExcel(base64String: string): void {
    const workbook: XLSX.WorkBook = XLSX.read(base64String, { type: 'base64' });

    // Assuming the first sheet is the one you want to preview
    const firstSheetName = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

    // Convert the worksheet to HTML
    const htmlString: string = XLSX.write(workbook, {
      bookType: 'html',
      type: 'string',
    });

    // Display the preview
    this.previewData = htmlString;
  }

  salvaDocumento() {
    let body = {
      base64: this.base64Documento,
    };
    console.log('BODY PER SALVATAGGIO DOCUMENTI: ' + JSON.stringify(body));
    this.anagraficaDtoService.salvaDocumento(body, this.token).subscribe(
      (result: any) => {
        console.log(
          'RISULTATO SALVATAGGIO DOCUMENTI: ' + JSON.stringify(result)
        );
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  //navbar
  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.ruolo = response.anagraficaDto.ruolo.nome;
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
  }

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        console.log('ID UTENTE PER NAV:' + this.idUtente);
        this.userRoleNav = response.anagraficaDto.ruolo.nome;
        if (
          (this.userRoleNav = response.anagraficaDto.ruolo.nome === 'ADMIN')
        ) {
          this.idNav = 1;
          this.generateMenuByUserRole();
        }
        if (
          (this.userRoleNav =
            response.anagraficaDto.ruolo.nome === 'DIPENDENTE')
        ) {
          this.idNav = 2;
          this.generateMenuByUserRole();
        }
      },
      (error: any) => {
        console.error(
          'Si è verificato il seguente errore durante il recupero del ruolo: ' +
            error
        );
        this.shouldReloadPage = true;
      }
    );
  }

  generateMenuByUserRole() {
    this.menuService
      .generateMenuByUserRole(this.token, this.idUtente)
      .subscribe(
        (data: any) => {
          this.jsonData = data;
          this.idFunzione = data.list[0].id;
          this.shouldReloadPage = false;
        },
        (error: any) => {
          console.error('Errore nella generazione del menu:', error);
          this.shouldReloadPage = true;
          this.jsonData = { list: [] };
        }
      );
  }

  getPermissions(functionId: number) {
    this.menuService.getPermissions(this.token, functionId).subscribe(
      (data: any) => {},
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }
}
