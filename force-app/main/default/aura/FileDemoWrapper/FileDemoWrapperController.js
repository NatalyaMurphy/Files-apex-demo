({
    fireRefresh : function(component, event, helper) {
        console.log('fire refresh');
        $A.get('e.force:refreshView').fire();
    }
})
