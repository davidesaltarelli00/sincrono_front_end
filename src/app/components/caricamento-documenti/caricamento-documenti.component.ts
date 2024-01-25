import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import { MenuService } from '../menu.service';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ThemeService } from 'src/app/theme.service';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../login/login-service';

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
  previewData: SafeHtml | undefined;
  token = localStorage.getItem('token');
  mobile: boolean=false;
  uploadProgress: number | undefined;
  uploadProgressColor: string = 'primary';
  elencoAnagraficheNonInserite$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  risposta:any;
  isVoiceActionActivated = false;
  toggleMode: boolean = false;
  aziendeClienti: any[] = [];
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
  orarioAttuale: Date = new Date();
  tokenExpirationTime: any;
  timer: any;
  idAnagraficaLoggata:any;

  constructor(
    private sanitizer: DomSanitizer,
    private anagraficaDtoService: AnagraficaDtoService,
    private menuService: MenuService,
    public themeService:ThemeService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private router:Router,
    private authService: AuthService
  ) {

    this.windowWidth = window.innerWidth;
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
    if (this.token) {
      const tokenParts = this.token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      this.tokenExpirationTime = Math.floor(tokenPayload.exp - currentTime);
      this.timer = setInterval(() => {
        this.tokenExpirationTime -= 1;
        this.cdRef.detectChanges();

        if (this.tokenExpirationTime === 0) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Attenzione:',
              message: 'Sessione terminata; esegui il login.',
            },
          });

          this.authService.logout().subscribe(
            (response: any) => {
              if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenProvvisorio');
                sessionStorage.clear();
                this.router.navigate(['/login']);
                this.dialog.closeAll();
              } else {
                console.log(
                  'Errore durante il logout:',
                  response.status,
                  response.body
                );
                this.handleLogoutError();
              }
            },
            (error: HttpErrorResponse) => {
              if (error.status === 403) {
                console.log('Errore 403: Accesso negato');
                this.handleLogoutError();
              } else {
                console.log('Errore durante il logout:', error.message);
                this.handleLogoutError();
              }
            }
          );
        }
      }, 1000);
    }
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.getAllAnagraficheNonInserite();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }

  getWindowWidth(): number {
    return this.windowWidth;
  }
  toggleHamburgerMenu(): void {
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
  }
  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
  }

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idAnagraficaLoggata]);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(
      remainingSeconds
    )}`;
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private handleLogoutError() {
    sessionStorage.clear();
    window.location.href = 'login';
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvvisorio');
  }

  salvaDocumento() {
    let body = {
      base64: this.base64Documento,
    };

    // console.log('BODY PER SALVATAGGIO DOCUMENTI: ' + JSON.stringify(body));

    this.anagraficaDtoService.salvaDocumento(body, this.token, {
      reportProgress: true,
      observe: 'events',
    }).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 100; // Completamento
          this.uploadProgressColor = 'primary'; // Cambia il colore a verde

          this.mostraAlert('success', 'Caricamento completato', (event as any).body.esito.target);

          this.risposta = event.body.list;
          this.elencoAnagraficheNonInserite$.next(this.risposta);
          localStorage.setItem('DatiSbagliati', JSON.stringify(this.risposta));
          this.cdRef.detectChanges();
          console.log("Elenco anagrafiche non inserite:", JSON.stringify(this.elencoAnagraficheNonInserite$));

        }
      },
      (error: any) => {
        this.uploadProgressColor = 'warn'; // Cambia il colore a rosso in caso di errore
        console.error(error);
        this.mostraAlert('danger', 'Errore durante il caricamento', 'Si è verificato un errore durante il caricamento del documento.');
      }
    );
  }

  getAllAnagraficheNonInserite() {
    const localStorageData = localStorage.getItem('DatiSbagliati');

    if (localStorageData) {
      try {
        const parsedData = JSON.parse(localStorageData);
        this.elencoAnagraficheNonInserite$.next(parsedData);
        console.log("DATI RECUPERATI:"+ JSON.stringify(localStorageData));
      } catch (error) {
        console.error('Errore nel parsing dei dati localStorage:', error);
        this.elencoAnagraficheNonInserite$.next([]);
      }
    } else {
      this.elencoAnagraficheNonInserite$.next([]);
    }
  }

  inserisci(codiceFiscale:any){
    this.router.navigate(['/nuova-anagrafica-dto-excel/', codiceFiscale]);
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

  //previewExcel(base64String: string): void {
    /*const workbook: XLSX.WorkBook = XLSX.read(base64String, { type: 'base64' });

    // Assuming the first sheet is the one you want to preview
    const firstSheetName = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

    // Convert the worksheet to HTML
    const htmlString: string = XLSX.write(workbook, {
      bookType: 'html',
      type: 'string',
    });

    // Display the preview
    this.previewData = htmlString;*/

//  }
previewExcel(base64String: string): void {
  const binaryString = atob(base64String);

  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const workbook: XLSX.WorkBook = XLSX.read(bytes, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

  const htmlString: string = this.sheetToHtml(worksheet);

  this.previewData = this.sanitizer.bypassSecurityTrustHtml(htmlString);
  console.log(this.previewData)
}


sheetToHtml(sheet: XLSX.WorkSheet): string {
  const range = sheet['!ref'] ? XLSX.utils.decode_range(sheet['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };

  let html = '<table style="border-collapse: collapse; width: 100%;">';

  for (let R = range.s.r; R <= range.e.r; ++R) {
    html += '<tr>';
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      const cell = sheet[cell_ref];

      // Get the cell value
      const value = cell ? cell.v : '';

      // Get the cell style
      const cellStyle = XLSX.utils.format_cell(cell);

      // Map Excel color codes to CSS color values
      const backgroundColorMatch = cellStyle.match(/background-color:(.*?);/);
      const backgroundColor = backgroundColorMatch ? backgroundColorMatch[1] : '';

      const fontColorMatch = cellStyle.match(/color:(.*?);/);
      const fontColor = fontColorMatch ? fontColorMatch[1] : '';

      // Determine the background color for the row and text color for the first row
      const rowBackgroundColor = R === range.s.r ? 'gray' : backgroundColor;
      const textColor = R === range.s.r ? 'white' : fontColor;

      // Apply style and color to the HTML with borders
      html += `<td style="background-color:${rowBackgroundColor}; color:${textColor}; border: 1px solid #000; padding: 8px;">${value}</td>`;
    }
    html += '</tr>';
  }

  html += '</table>';
  return html;
}


  mostraAlert(tipo: string, titolo: string, messaggio: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        image: tipo === 'danger' ? '../../../../assets/images/danger.png' : '../../../../assets/images/logo.jpeg',
        title: titolo,
        message: messaggio,
      },
    });
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
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
