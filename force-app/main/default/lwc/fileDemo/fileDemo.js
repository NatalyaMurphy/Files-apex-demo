import { LightningElement, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import createFile from '@salesforce/apex/FileDemoController.createFile';
import createFileFaster from '@salesforce/apex/FileDemoController.createFileFaster';
import readFromFile from '@salesforce/apex/FileDemoController.readFromFile';
import overwriteFile from '@salesforce/apex/FileDemoController.overwriteFile';
import deleteFile from '@salesforce/apex/FileDemoController.deleteFile';

export default class FileDemo extends LightningElement {
    @track textContent;
    contentVersionId;
    @api recordId;
    error;

    createFile(){
        this.textContent = this.template.querySelector('lightning-textarea').value;
        console.log('create file with:\n', this.textContent);
        createFile({ fileContent: this.textContent, parentId: this.recordId })
        .then((result) => {
            this.contentVersionId = result;
            this.error = undefined;
            updateRecord({ fields: { Id: this.recordId } });

        })
        .catch((error) => {
            this.error = JSON.stringify(error);
            this.contentVersionId = undefined;
        });
    }

    createFileFaster(){
        this.textContent = this.template.querySelector('lightning-textarea').value;
        console.log('create file with:\n', this.textContent);
        createFileFaster({ fileContent: this.textContent, parentId: this.recordId })
        .then((result) => {
            this.contentVersionId = result;
            this.error = undefined;
            updateRecord({ fields: { Id: this.recordId } });

        })
        .catch((error) => {
            this.error = JSON.stringify(error);
            this.contentVersionId = undefined;
        });
    }

    readFromFile(){
        console.log('read from file');
    }

    overwriteFile(){
        console.log('overwrite file');
    }

    deleteFile(){
        console.log('delete file');
    }

    getTextValue(event){
        this.textContent = event.detail.value;
        console.log('content: ', this.textContent);
    }

}