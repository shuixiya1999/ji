Ext.application({
        	launch: function(){
        		Ext.Viewport.add({
					xtype: 'navigationview',
			items: [{
				title: 'First',
//						html: 'dsdsssss<br>ssssssss'
                    items: [{
                        xtype: 'button',
                       text: 'Push a new view!',
                        handler: function(b) {
                           // use the push() method to push another view. It works much like
                           // add() or setActiveItem(). it accepts a view instance, or you can give it
                           // a view config.
                        	b.parent.parent.push({
                        		title: 'Second',
                        		html: 'Second view!'
                        	});
                           console.info(arguments);
                       	//alert('ssss');
////                                    view.push({
////                                        title: 'Second',
////                                        html: 'Second view!'
////                                    });
                        }
                    }]
                }]
        });
	}
});