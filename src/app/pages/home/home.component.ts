import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';

declare var chrome: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  addPostForm: FormGroup;
  categoryList = []
  masterUsersList = []
  isLoading = false;
  loggedInUser = null;
  isBgProcessRunning = false;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {
    this.init()
  }

  async init() {
    this.loggedInUser = this.authenticationService.credentials ? this.authenticationService.credentials : null;
    console.log('await this.checkInStorage(): ', await this.checkInStorage('isBgProcessRunning'));
    if (await this.checkInStorage('isBgProcessRunning')) {
      this.isBgProcessRunning = true;
    } else {
      this.isBgProcessRunning = false;
      this.createForm();
      this.start();
    }
    await this.getDummyUsers();
  }

  ngOnInit() {

  }

  checkInStorage(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], function (result) {
        resolve(result.isBgProcessRunning);
      });
    })
  }

  createForm() {
    this.addPostForm = this.formBuilder.group({
      user: [null, Validators.required],
      category: [null, Validators.required],
      number: [null, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    this.handleUserDropdown()
  }

  handleUserDropdown() {
    if (this.loggedInUser && this.loggedInUser.isSeed) {
      this.addPostForm.controls['user'].patchValue(this.loggedInUser._id);
      this.addPostForm.controls['user'].disable();
    }
  }


  getDummyUsers() {
    return new Promise((resolve, reject) => {
      this.authenticationService.apiCall('get', '/get-seed-users').subscribe((users) => {
        this.masterUsersList = users;
        resolve(users);
      }, error => {
        resolve(null);
      })
    })
  }

  async start() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url !== 'https://answers.yahoo.com/') {
      await chrome.tabs.update(null, { url: "https://answers.yahoo.com" });
      chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
        if (tab && tab.status === 'complete') {
          this.getCategories(tab)
        }
      });
    } else {
      this.getCategories(tab)
    }
  }


  getCategories(tab) {
    console.log('tab: ', tab);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/get-categories.js'],
    }, (data) => {
      console.log('getCategories executeScript data: ', data);
    });
    const that = this;
    chrome.runtime.onMessage.addListener(function getCategoriesData(request, sender) {
      console.log('request: ', request);
      if (request.action === "getCategoriesData") {
        chrome.runtime.onMessage.removeListener(getCategoriesData);
        if (request.data && request.data.data) {
          console.log('request.data.data: ', request.data.data);
          // that.categoryList = request.data.data.map(f => { return { category: f.name } })
          that.categoryList = request.data.data;
          // that.sendDataToSite(request.data.data)
        }
      }
    });

  }

  async sendDataToSite(data) {
    console.log('data: ', data);
    const questionData = [
      {
        "_id": "1",
        "description": "explain",
        "image": null,
        "hashtags": [
          {
            "topicName": "computer",
            "displayName": "computer"
          },
          {
            "topicName": "digital",
            "displayName": "digital"
          }
        ],
        "question": null,
        "opinion": [],
        "reply": [],
        "judgement": [],
        "isPublished": false,
        "isPlugin": true,
        "user": {
          "_id": "605048f02071950c308db058",
          "imageName": "profile/200_Koala.jpg",
          "userName": "john"
        },
        "title": "Why use Chrome?",
        "type": "QUESTION",
        "answers": [
          {
            "_id": "2",
            "description": null,
            "image": null,
            "hashtags": [],
            "question": "6050848d2071950c308db0c9",
            "opinion": [],
            "reply": [],
            "judgement": [],
            "isPublished": false,
            "isPlugin": true,
            "user": {
              "_id": "605048f22071950c308db071",
              "imageName": null,
              "badge": null,
              "userName": "zzzz"
            },
            "title": "no don't use chrome as it is use more memory",
            "type": "ANSWER"
          },
          {
            "_id": "3",
            "description": null,
            "image": null,
            "hashtags": [],
            "question": "6050848d2071950c308db0c9",
            "opinion": [],
            "reply": [],
            "judgement": [],
            "isPublished": false,
            "isPlugin": true,
            "user": {
              "_id": "605048f02071950c308db05a",
              "imageName": null,
              "badge": null,
              "userName": "cccc"
            },
            "title": "bcoz chrome is more faster",
            "type": "ANSWER"
          }
        ]
      },
      {
        "_id": "4",
        "description": "dsafads",
        "image": null,
        "hashtags": [
          {
            "topicName": "fastfood1111",
            "displayName": "fastfood1111"
          }
        ],
        "question": null,
        "opinion": [],
        "reply": [],
        "judgement": [],
        "isPublished": false,
        "isPlugin": true,
        "user": {
          "_id": "605048f02071950c308db058",
          "imageName": "profile/200_Koala.jpg",
          "badge": null,
          "userName": "john"
        },
        "title": "Is microwaved leftover pizza good or should I just reheat it in the oven?",
        "type": "QUESTION",
        "answers": [
          {
            "_id": "5",
            "description": null,
            "image": null,
            "hashtags": [],
            "question": "60506ffd2071950c308db0ab",
            "opinion": [],
            "reply": [],
            "judgement": [],
            "isPublished": false,
            "isPlugin": true,
            "user": {
              "_id": "605048f02071950c308db05a",
              "imageName": null,
              "badge": null,
              "userName": "cccc"
            },
            "title": "asdfadsf",
            "type": "ANSWER"
          }
        ]
      }
    ]

    chrome.runtime.sendMessage({
      action: "SET_SITE_DATA",
      data: { success: true, data: questionData }
    });

  }

  onSubmit() {
    const formValue = _.cloneDeep(this.addPostForm.getRawValue());
    if (formValue.category) {
      const [selectedCategory] = this.categoryList.filter(e => e.name === formValue.category)
      if (selectedCategory && selectedCategory.link) {
        formValue.category = selectedCategory;
        const payload = {
          value: formValue,
          users: this.masterUsersList
        }
        console.log('payload: ', payload);
        chrome.runtime.sendMessage({
          action: "START_BACKGROUND",
          data: { success: true, data: payload }
        });
      }
    }
  }
}
