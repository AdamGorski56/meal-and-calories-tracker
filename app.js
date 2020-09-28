//Storage Controller




// Iteam Controller

const ItemCtrl = (function(){

    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [
            
        ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        
        getItems: function(){
            return data.items
        },
        addItem : function (name, calories){
            //Create ID
            let ID;
            if(data.items.lenght > 0){
                ID = data.items[data.items.lenght -1].id +1;
            } else {
                ID = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new Item
            newItem = new Item(ID, name, calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
            
        },

        getItemById: function(id){
            let found = null;
            //Loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },

        updateItem: function(name, calories) {
            //Calories to numer
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        deleteItem: function (id){
            //Get ids
            const ids = data.items.map(function(item){
                return item.id;
            })
            //Get index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index,1);
        },
        clearAllItems: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },

        getTotalCalories: function(){
            let total = 0;
            //Loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories;
            })
            data.totalCalories = total;
            return data.totalCalories;
        },


        logData: function(){
            return data;
        }
    }

})();




//UI Controller

const UICtrl = (function(){

    const UISelectors = {
        itemList : '#item-list',
        listItems: '#item-list li',
        addBtn : '.add-btn',
        updateBtn : '.update-btn',
        deleteBtn : '.delete-btn',
        backBtn : '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput : '#item-name',
        itemCaloriesInput : '#item-calories',
        totalCalories: '.total-calories'
    }

    

    return{
        populateItemList: function(items){
            let html= '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                 </a>
                </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
       

        getItemInput : function(){
          return {
              name: document.querySelector(UISelectors.itemNameInput).value,
              calories: document.querySelector(UISelectors.itemCaloriesInput).value
          }
        },
        addListItem : function (item){
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            //Add HTML
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
             </a>`;
             //Insert item
             document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Turn nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML =  `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                     </a>` ;
                }
            });
        },

        delateListItem: function (id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn Node elist into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        }, 
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(e){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            
        },
        showEditState: function(){
           
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function (){
            return UISelectors;
        },
        
    }

})();




// App Controller

const App = (function(ItemCtrl, UICtrl){

    //Load Event Listeners
    const LoadEventListeners = function(){
        //Get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })
        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        //delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        //clear button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    //Add item submit

    const itemAddSubmit = function(e){
        //Get input from UI Controller
        const input = UICtrl.getItemInput();
        
        //Check for name and calorie input

        if(input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            //Clear input fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    //click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item id
            
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split('-');
            //get the acctual id
            id = parseInt(listIdArr[1]);
            //get item
            const itemToEdit = ItemCtrl.getItemById(id);
            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            //add item to form
            UICtrl.addItemToForm();

        }
        e.preventDefault()
    }
    //update item submit
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // update UI
        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearEditState();

        
        
        e.preventDefault();
    }

    //delete button event
    const itemDeleteSubmit = function (e){
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        //delete from UI
        UICtrl.delateListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearEditState();
        e.preventDefault();
    }

    const clearAllItemsClick = function(){
        //Delete all items from data structure
        ItemCtrl.clearAllItems();
        // Remove from UI
        const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.removeItems();

        //Hide UL
        UICtrl.hideList();
        
    }

    //public methods
    return{
        init: function(){
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            //check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                UICtrl.populateItemList(items);
            }
            
            //Load Event Listeners
            LoadEventListeners();
        }
    }

})(ItemCtrl, UICtrl);

App.init();
