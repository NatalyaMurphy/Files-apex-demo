/*
This method will always work to create new content and is the method most frequently found online...
...but check out the createFileFaster() method below
*/
public with sharing class FileDemoController {
    @AuraEnabled public static Id createFile(String fileContent, Id parentId){
        Id versionId;
        String first25 = fileContent.left(25);

//Create ContentVersion
        ContentVersion cv = new ContentVersion(
            ContentLocation = 'S', // Salesforce. The other option is: 'E'
            pathOnClient = first25 + '.txt',
            title = first25,
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

    /*
    This method works for creating a brand-new file and immediately linking it to ONE parent record.
    The key is to populate the firstPublishLocationId with the parent record ID
*/
    @AuraEnabled public static Id createFileFaster(String fileContent, Id parentId){
        Id versionId;
        String first25 = fileContent.left(25);

        ContentVersion cv = new ContentVersion(
            ContentLocation = 'S', // Salesforce. The other option is: 'E'
            pathOnClient = first25 + '.txt',
            title = first25,
            versionData = Blob.valueOf(fileContent),
            firstPublishLocationId = parentId
        );
        insert cv;
        versionId = cv.Id;

        return versionId;   
    }

    @AuraEnabled public static Id saveNewVersion(String fileContent, Id parentId, Id contentVersionId){
        Id versionId;

        //NOTE: Not selecting FirstPublishLocationId
        //link will auto-update with new version
        ContentVersion cv = [SELECT ContentLocation, pathOnClient, title, 
            ContentDocumentId
        FROM ContentVersion
        WHERE Id = :contentVersionId];

        ContentVersion toInsert = cv.clone(false, false, false, false);
        toInsert.VersionData = Blob.valueOf(fileContent);

        insert toInsert;

        return toInsert.Id;   
    }

    @AuraEnabled public static String readFromFile(Id contentVersionId ){
        String content;
        ContentVersion cv = [SELECT versionData
                             FROM ContentVersion
                             WHERE Id = :contentVersionId];
                             
        content = cv.VersionData.toString();
        return content;   
    }

    /*
    WARNING: This removes all traces of the document AND removes all links to the document from all parent objects
    */

    @AuraEnabled public static void deleteFile(Id contentVersionId ){
        ContentDocument toDelete =
        [SELECT Id 
         FROM ContentDocument
         WHERE LatestPublishedVersionId = :contentVersionId];

         delete toDelete;
    }
    
}
