public with sharing class FileDemoController {
    @AuraEnabled public static Id createFile(String fileContent, Id parentId){
        Id versionId;


//Create ContentVersion
        ContentVersion cv = new ContentVersion(
            ContentLocation = 'S', // Salesforce. The other option is: 'E'
            pathOnClient = 'Demo File.txt',
            title = 'Demo File',
            versionData = Blob.valueOf(fileContent)
        );
        insert cv;
        versionId = cv.Id;

//get the ContentDocumentId from that
        cv = [SELECT ContentDocumentId
              FROM ContentVersion
              WHERE Id = :versionId];

//use ContentDocumentId to create ContentDocumentLink
        ContentDocumentLink link = new ContentDocumentLink(
            ContentDocumentId = cv.ContentDocumentId,
            LinkedEntityId = parentId
        );
        insert link;

        return versionId;   
    }

    @AuraEnabled public static Id createFileFaster(String fileContent, Id parentId){
        Id versionId;

        ContentVersion cv = new ContentVersion(
            ContentLocation = 'S', // Salesforce. The other option is: 'E'
            pathOnClient = 'Demo File Shortcut.txt',
            title = 'Demo File Shortcut',
            versionData = Blob.valueOf(fileContent),
            firstPublishLocationId = parentId
        );
        insert cv;
        versionId = cv.Id;

        return versionId;   
    }

    @AuraEnabled public static Id overwriteFile(String fileContent, Id parentId, Id contentVersionId){
        Id versionId;
        return versionId;   
    }

    @AuraEnabled public static String readFromFile(Id contentVersionId ){
        String content;
        return content;   
    }

    @AuraEnabled public static void deleteFile(Id contentVersionId ){
        String content;
        // return content;   
    }
    
}
