import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: BehaviorSubject<Observable<firebase.User | null>> = new BehaviorSubject<Observable<firebase.User | null>>(null);
  public user$ = this.user.asObservable().pipe(switchMap((user: Observable<firebase.User | null>) => user));

  constructor(private angularFireAuth: AngularFireAuth) {
    this.user.next(this.angularFireAuth.authState);
  }

  public loginViaGoogle(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
  }

  public logout(): Observable<void> {
    return from(this.angularFireAuth.signOut());
  }
}