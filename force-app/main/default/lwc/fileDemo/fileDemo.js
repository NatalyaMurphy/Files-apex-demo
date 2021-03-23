import { LightningElement, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getRecordNotifyChange } from 'lightning/uiRecordApi';
import createFile from '@salesforce/apex/FileDemoController.createFile';
import createFileFaster from '@salesforce/apex/FileDemoController.createFileFaster';
import readFromFile from '@salesforce/apex/FileDemoController.readFromFile';
import overwriteFile from '@salesforce/apex/FileDemoController.overwriteFile';
import deleteFile from '@salesforce/apex/FileDemoController.deleteFile';

export default class FileDemo extends LightningElement {
    @track textContent;
    @track contentVersionId;
    @api recordId;
    error;

    createFile(){
        this.textContent = this.template.querySelector('lightning-textarea').value;
        console.log('create file with:\n', this.textContent);
        createFile({ fileContent: this.textContent, parentId: this.recordId })
        .then((result) => {
            this.contentVersionId = result;
            this.error = undefined;
            this.dispatchEvent(new CustomEvent('fileupdate'));
            getRecordNotifyChange([{recordId: this.recordId}]);
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'File Saved',
                variant: 'success'
            });
            this.dispatchEvent(event);

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
            this.dispatchEvent(new CustomEvent('fileupdate'));
            getRecordNotifyChange([{recordId: this.recordId}]);
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'File Saved',
                variant: 'success'
            });
            this.dispatchEvent(event);
        })
        .catch((error) => {
            this.error = JSON.stringify(error);
            this.contentVersionId = undefined;
        });
    }

    readFromFile(){
        console.log('read from file with ID ', this.contentVersionId);
        readFromFile({ contentVersionId: this.contentVersionId })
        .then((result) => {
            console.log('file contents:\n', result);
            this.textContent = result;
            const textarea = this.template.querySelector('lightning-textarea');
            textarea.focus();
            try {
            textarea.setRangeText(this.textContent, 0, 100, 'end');
            } catch(e){
                this.error = e;
            }
            this.dispatchEvent(new CustomEvent('fileupdate'));
    
            this.error = undefined;
        })
        .catch((error) => {
            this.error = JSON.stringify(error);
            this.textContent = undefined;
        });
    }

    overwriteFile(){
        console.log('overwrite file');
    }

    deleteFile(){
        console.log('delete file');
        console.log('read from file with ID ', this.contentVersionId);
        deleteFile({ contentVersionId: this.contentVersionId })
        .then((result) => {
            this.contentVersionId = undefined;   
            this.error = undefined;
            this.dispatchEvent(new CustomEvent('fileupdate'));
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'File Deleted',
                variant: 'warning'
            });
            this.dispatchEvent(event);
        })
        .catch((error) => {
            this.error = JSON.stringify(error);
        });

    }

}