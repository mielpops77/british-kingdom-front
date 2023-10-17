
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cat } from '../../../models/cats';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CatService } from '../../Services/catService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mes-chats',
  templateUrl: './mes-chats.component.html',
  styleUrls: ['./mes-chats.component.css']
})
export class MesChatsComponent implements OnInit {

  displayedColumns: string[] = ['photo', 'nom', 'dateOfBirth', 'sex', 'robe', 'breed', 'couleursYeux', 'actions'];
  cats: Cat[] = [];
  catSubscription: Subscription | undefined;
  url = environment;

  constructor(private http: HttpClient, private router: Router, private catService: CatService) { }

  ngOnInit(): void {

    this.catSubscription = this.catService.cat$.subscribe(cats => {
      if (cats) { this.cats = cats }
      console.log('voyons voir le bordelos', this.cats);
    });

  }





  deleteChat(id: number, images: [], urlProfil: string, urlProfilFather: string, urlProfilMother: string) {
    // Logique pour supprimer le chat
    console.log('this.cats', this.cats);

    this.http.delete(environment.apiUrlCats + id).subscribe(
      () => {
        // Suppression réussie, mettre à jour la liste de chats


        let tabImgParents = [];
        tabImgParents.push(urlProfilFather);
        tabImgParents.push(urlProfilMother);
        let tabImgProfil = [];
        tabImgProfil.push(urlProfil);



        this.deleteMissingImages(images, 'CatsImages');
        this.deleteMissingImages(tabImgParents, 'CatsParents');
        this.deleteMissingImages(tabImgProfil, 'CatsProfil');

        this.cats = this.cats.filter(cat => cat.id !== id);


        this.catService.refreshCatData(this.cats);


      },
      (error) => {
        console.error('Erreur lors de la suppression du chat:', error);
      }
    );
  }

  // ...

  editChat(cat: Cat) {
    console.log('cdzadzadzzdazdat', cat);
    localStorage.setItem('selectedCatEdit', JSON.stringify(cat));
    localStorage.setItem('allCats', JSON.stringify(this.cats));

    this.router.navigateByUrl('/admin/meschats/edition/' + cat.id);
  }

  navigateToNewCat() {
    this.router.navigate(['admin/meschats/nouveauChat']);
  }


  deleteMissingImages(elementsToDelete: string[], directory: string): void {

    console.log('elementsToDelete', elementsToDelete);
    this.catService.deleteMissingImages(elementsToDelete, directory).subscribe(
      response => {
        if (response.status === 200) {
          console.log('Images deleted successfully', response);
        } else {
          console.error('Error deleting images - Invalid response status', response);
        }
      },
      error => {
        if (error.status !== 200) {
          console.error('Error deleting images', error.status);
        } else {
          console.log('Images deleted successfully');
        }
      }
    );
  }


}
