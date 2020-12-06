import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
// import { HTTP } from '@ionic-native/http/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {

  uri = 'http://127.0.0.1:3000/';
  authSt = new BehaviorSubject(false);
  userID: number;
  programs = [];
  justGot = false;

  constructor(
      private http: HttpClient,
      public info: Storage
  ) { }

  async login(userInfo) {
    return await new Promise<any>((res) => {
      // this.authSt.next(true); //remove
      // res(true); //remove
      // return; //remove
      this.postReq('login', {}, userInfo).then(async (d) => {
        // console.log('login meethod');
        // console.log(d);
        if (d.status === 'success') {
          this.info.set('user', JSON.stringify(d.user[0]));
          this.userID = d.user.u_id;
          this.info.set('posts', JSON.stringify(d.posts));
          this.info.set('programs', JSON.stringify(d.program));
          this.programs = d.program;
          for (const i in this.programs) {
            if(this.programs[i].pr_id == d.subs.s_programID) {
              this.programs[i].subscribed = true;
            }
          }
          this.info.set('subs', JSON.stringify(d.subs));
          await this.info.set('posts', JSON.stringify(d.posts));
          this.authSt.next(true);
          res(true);
        } else {
          res(false);
        }
      });
    });

  }

  async autoLogin() {
    this.info.get('user').then((val) => {
      if (val) {
        val = JSON.parse(val);
        this.userID = val.u_id;
        this.authSt.next(true);
        this.getPosts().then(() => {
          this.justGot = true;
        });
      }
    });
  }

  async register(userInfo) {
    return await this.login(userInfo);
  }

  async logout() {
    await this.info.remove('user');
    this.authSt.next(false);
  }

  async getReq(suburl, head, param) {
    return await new Promise<any>((res) => {
      this.http.get(this.uri + suburl, {
        headers: head,
        params: param
      }).subscribe((data) => {
        // console.log(data);
        res(data);
      });
    });
  }

  async postReq(suburl, head, body) {
    return await new Promise<any>((res) => {
      head['Content-Type'] = 'application/json; charset=UTF-8';
      this.http.post(this.uri + suburl, body, {
        headers: head
      }).subscribe((data) => {
        console.log(data);
        res(data);
      });
    });
  }

  isAuthenticated(): boolean {
    return this.authSt.value;
  }

  // 0 for reg user, [] for affiliated programs for program manager, 2 for admin
  async getPriv() {
    return await this.info.get('user').then((res) => {
      res = JSON.parse(res);
      // console.log(res);
      if (res.u_adminPriv || res.u_programPriv) {
        if (res.u_adminPriv === 1) {
          return 2;
        }
        if (res.u_programPriv === 1) {
          // const pr = [];
          // // tslint:disable-next-line:prefer-for-of
          // for (let i = 0; i < this.programs.length; i++) {
          //   if (Array.isArray(this.programs[i].pr_programManagerUserID) &&
          //       this.programs[i].pr_programManagerUserID.indexOf(this.userID) > -1) {
          //     pr.push(this.programs[i]);
          //   } else if (this.programs[i].pr_programManagerUserID === this.userID) {
          //     pr.push(this.programs[i]);
          //   }
          // }
          // console.log(res);
          return res.u_affiliatedProgramID;
        }
        return 0;
      }
      return -1;
    });
  }

  async getPosts() {
    return await new Promise<any>(async (res) => {
      let posts;
      try {
        if (this.userID && !this.justGot) {
          posts = (await this.getReq('getPosts', {}, {user_id: this.userID})).posts;
          this.info.set('posts', JSON.stringify(posts));
        } else {
          this.justGot = false;
          throw new Error('swf');
        }
      } catch (e) {
        posts = JSON.parse(await this.info.get('posts'));
      }
      res(posts);
    });
  }

  async getProgramByID(pid) {
    this.programs = await this.getData('programs');
    for (const i in this.programs) {
      if (this.programs[i].pr_id === pid) {
        return await this.programs[i];
      }
    }
    return 0;
  }

  async getItemsBought() {
    return await new Promise<any>(async (res) => {
      let ib;
      try {
        this.userID = JSON.parse(await this.info.get('user')).u_id;
        if (this.userID) {
          ib = (await this.getReq('getItemsBought', {}, {user_id: this.userID})).items;
          for (const ibKey in ib) {
            ib[ibKey].program = await this.getProgramByID(ib[ibKey].i_programID);
          }
          this.info.set('ib', JSON.stringify(ib));
          res(ib);
        } else {
          throw new Error('swf');
        }
      } catch (e) {
        ib = JSON.parse(await this.info.get('ib'));
      }
      res(ib);
    });
  }

  async getItems() {
    return await new Promise<any>(async (res) => {
      let items;
      try {
        items = (await this.getReq('getItems', {}, {user_id: this.userID})).items;
        for (const ibKey in items) {
          items[ibKey].program = this.getProgramByID(items[ibKey].i_programID);
        }
        this.info.set('items', JSON.stringify(items));
      } catch (e) {
        items = JSON.parse(await this.info.get('items'));
      }
      res(items);
    });
  }

  async getPrograms() {
    return await new Promise<any>(async (res) => {
      let program;
      try {
        this.userID = JSON.parse(await this.info.get('user')).u_id;
        if (this.userID) {
          const data = await this.getReq('getPrograms', {}, {user_id: this.userID});
          program = data.programs
          for (const ibKey in program) {
            for (const j in data.subscriptions) {
              if(program[ibKey].pr_id == data.subscriptions[j].s_programID) {
                program[ibKey].subscribed = true;
              }
            }
          }
          this.info.set('programs', JSON.stringify(program));
          this.programs = program;
          res(program);
        } else {
          throw new Error('swf');
        }
      } catch (e) {
        program = JSON.parse(await this.info.get('programs'));
      }
      res(program);
    });
  }

  updateQuanity(id, num) {
    this.postReq('updateItemQuantity', {}, {"item_id": id, "quantity": num});
  }

  async getData(dataName) {
    return JSON.parse(await this.info.get(dataName));
  }

  async setData(dataName, data) {
    await this.info.set(dataName, JSON.stringify(data));
  }
}
