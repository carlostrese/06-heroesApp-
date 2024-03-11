import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('',{ nonNullable: true}),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters:       new FormControl<string>(''),
    alt_img:          new FormControl(''),
  });
  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'MARVEL Comics',
      desc: 'MARVEL - Comics'
    }
  ];

  constructor(
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ){
  }

  get currenHero():Hero{
    const hero =  this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;
    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.heroService.getHeroById(id) ),
    ).subscribe( hero =>{
      if(!hero) return this.router.navigateByUrl('/');
      this.heroForm.reset(hero);
      return;
    })
  }

  onSubmit():void{
   if(this.heroForm.invalid) return;
   if(this.currenHero.id){
    this.heroService.updateHero( this.currenHero)
    .subscribe(hero => {
      //TODO: mostrar snackbar
      this.showSnackbar(`${ hero.superhero} update!`);
    });
    return;
   }
   this.heroService.addHero(this.currenHero)
   .subscribe(hero => {
    //TODO: mostrar snackbar, y navegar a /heroes/edit/hero/edit/ hero.id
    this.router.navigate(['/heroes/edit',hero.id]);
    this.showSnackbar(`${ hero.superhero} created!`);
   });
  }

  onDeleteHero(){
    if( !this.currenHero.id) throw Error('Hero id is requirex');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });
    dialogRef.afterClosed()
    .pipe(
      filter((result:boolean)  => result ),
      switchMap(()=> this.heroService.deleteHeroById(this.currenHero.id)),
      filter((wasDeletec:boolean)  => wasDeletec ),
    )
    .subscribe(result => {
      this.router.navigate(['/heroes']);
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   if (!result)return;
    //   this.heroService.deleteHeroById(this.currenHero.id)
    //   .subscribe( wasDeletec => {
    //     if (wasDeletec)
    //     this.router.navigate(['/heroes']);
    //   })

    // });
  }

  showSnackbar(message:string):void{
    this.snackBar.open(message,'done',{duration:2500});
  }
}
