import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
// import { HTTP } from '@ionic-native/http/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {

  uri = "http://127.0.0.1:3000/";
  authSt = new BehaviorSubject(false);

  constructor(
      private http: HttpClient,
      public info: Storage
  ) { }

  async login(userInfo) {
    await this.info.set("user", JSON.stringify(userInfo));
    this.authSt.next(true);
  }

  async logout() {
    await this.info.remove("user");
    this.authSt.next(false);
  }

  async getReq(head, param) {
    // let postData = {
    //   "name": "Customer004",
    //   "email": "customer004@email.com",
    //   "tel": "0000252525"
    // }
    //
    // this.http.post("http://127.0.0.1:3000/customers", postData, requestOptions)
    //     .subscribe(data => {
    //       console.log(data['_body']);
    //     }, error => {
    //       console.log(error);
    //     });
    return await new Promise<any>((res) => {
      // var headers = new HttpHeaders();
      // headers.append("Accept", 'application/json');
      // headers.append('Content-Type', 'application/json' );
      // const requestOptions = new HttpRequest({ headers: headers });
      this.http.get(this.uri, {}).subscribe((data) => {
        console.log(data);
        res(data);
      });
    });
  }

  isAuthenticated(): boolean {
    return this.authSt.value;
  }

  //0 for reg user, 1 for program manager, 2 for admin
  async getPriv() {
    await this.info.get('user').then((res) => {
      if(res) {
        let priv = [res['priv']];
        if(priv[0] == 1) {
          priv.push(res['programs']);
        }
      }
      return -1;
    })
  }
}
