import { ImageService } from './../image.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../login/login-service';
import { ProfileBoxService } from './profile-box.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MenuService } from '../menu.service';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import { ImmagineComponent } from '../immagine/immagine.component';
@Component({
  selector: 'app-profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss'],
})
export class ProfileBoxComponent {
  immaginePredefinita: string | null = null;
  isRisorseUmane: boolean = false;
  anagrafica: any;
  username_accesso = null;
  codiceFiscaleUtenteLoggato: any;
  id: any;
  mobile: any = false;
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  base64Data: any;
  profilePic: any;
  immagine: any;
  immagineConvertita: any; // Proprietà per immagine convertita in base64
  immagineNonConvertita: any; // Proprietà per immagine non convertita in Blob
  salvaImmagine: boolean = false;
  immagineCancellata: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  bodyGet: FormGroup = new FormGroup({
    codiceFiscale: new FormControl(null),
  });
  bodyAdd: FormGroup = new FormGroup({
    codiceFiscale: new FormControl(null),
    base64: new FormControl(null),
  });
  userLoggedFiscalCode: any;
  elencoCommesse: any[] = [];

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private menuService: MenuService,
    private anagraficaDtoService: AnagraficaDtoService
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
    this.bodyGet = this.formBuilder.group({
      codiceFiscale: new FormControl(null),
    });
  }
  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    }

    const token = localStorage.getItem('token');
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        this.id = response.anagraficaDto.anagrafica.id;
        this.username_accesso = response.anagraficaDto.anagrafica.mailAziendale;
        this.codiceFiscaleUtenteLoggato =
          response.anagraficaDto.anagrafica.codiceFiscale;
        this.bodyGet.setValue({
          codiceFiscale: this.codiceFiscaleUtenteLoggato,
        });
        this.getImage();
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
  }

  vediImmagineProfilo(){
    this.dialog.open(ImmagineComponent);
  }

  addImage() {
    if (this.fileInput && this.fileInput.nativeElement.files.length > 0) {
      const selectedFile: File = this.fileInput.nativeElement.files[0];

      this.convertImageToBase64(selectedFile).then((base64String) => {
        let body = {
          codiceFiscale: this.codiceFiscaleUtenteLoggato,
          base64: base64String,
        };
        // console.log('BODY PER ADD: ' + JSON.stringify(body));
        this.imageService.addImage(this.token, body).subscribe(
          (response: any) => {
            if ((response as any).esito.code != 200) {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  title: 'Salvataggio non riuscito:',
                  message: (response as any).esito.target,
                },
              });
            } else {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  title: 'Immagine salvata correttamente:',
                  message: (response as any).esito.target,
                },
              });
              this.immagine = response;
              this.getImage();
              location.reload();
            }
          },
          (error: any) => {
            console.error(
              'Errore durante l invio dell immagine: ' + JSON.stringify(error)
            );
          }
        );
      });
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Attenzione:',
          message: 'Nessuna immagine selezionata.',
        },
      });
    }
  }

  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleUtenteLoggato,
    };
    // console.log('BODY PER GET IMAGE: ' + JSON.stringify(body));
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        if (this.immagine) {
          this.convertBase64ToImage(this.immagine);
        } else {
          this.immaginePredefinita =
            '../../../../assets/images/profilePicPlaceholder.png';
        }
      },
      (error: any) => {
        console.error(
          "Errore durante il caricamento dell'immagine: " +
            JSON.stringify(error)
        );

        // Assegna un'immagine predefinita in caso di errore
        this.immaginePredefinita =
          '../../../../assets/images/profilePicPlaceholder.png';
      }
    );
  }

  cancelImage() {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: '',
        message: 'Cambio immagine annullato.',
      },
    });
    location.reload();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      this.convertImageToBase64(selectedFile).then((base64String) => {
        this.immagineConvertita = base64String;
        this.salvaImmagine = true;
      });
    } else {
      this.salvaImmagine = false;
    }
  }

  goToRapportinoByCodiceFiscale() {
    this.router.navigate(['/utente/' + this.id]);
  }

  convertBase64ToImage(base64String: string): void {
    this.immagineConvertita = base64String;
  }

  convertImageToBase64(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }
  convertBase64ToBlob(base64String: string, format: string): Blob {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: `image/${format}` });
  }

  storicizzaCommessa(id: number, posizione: number) {
    console.log('ID COMMESSA DA STORICIZZARE: ' + id);
    console.log("Posizione nell'array: " + posizione);

    // const payload = {
    //   anagraficaDto: {
    //     anagrafica: null,
    //     contratto: null,
    //     commesse: [this.elencoCommesse[posizione]],
    //     ruolo: null
    //   },
    // };
    const payload = {
      commessa: this.elencoCommesse[posizione],
    };

    console.log(JSON.stringify(payload));

    this.anagraficaDtoService
      .storicizzaCommessa(payload, localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          console.log(
            'Commessa storicizzata correttamente: ' + JSON.stringify(res)
          );
          alert('Commessa storicizzata correttamente.');
          this.ngOnInit();
        },
        (error: any) => {
          alert(
            'Si è verificato un errore durante la storicizzazione della commessa selezionata: ' +
              error
          );
        }
      );
  }

  modificaCommessa() {
    this.router.navigate(['/modifica-anagrafica/' + this.id]);
  }

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.userLoggedFiscalCode =
          response.anagraficaDto.anagrafica.codiceFiscale;
        this.elencoCommesse = response.anagraficaDto.commesse;
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
    this.menuService.generateMenuByUserRole(this.token, this.idNav).subscribe(
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
