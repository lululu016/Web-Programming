var storage = window.localStorage;
//storage.clear();
var toggle=0;
function $(id) {
    return document.getElementById(id);
}

function setStyleSheet(title){  
    var link_list = document.getElementsByTagName("link");
    if ( link_list ){
        for ( var i=0;i<link_list.length;i++ ){
            if ( link_list[i].getAttribute("rel").indexOf("style") != -1 ){
                link_list[i].disabled = true;
                if ( link_list[i].getAttribute("title") === title){
                    link_list[i].disabled = false;
                }
            }
        }
    }
}

window.onload = function() {    
    model.init(function() {
        var data = model.data;
        data.filter="ALL";

        //add
        function addEntry(){
            var todo=$('todo').value;
            if(todo==""){
                alert("input can not be blank")
                return 0;
            }
            $('todo').value='';

            //time
            var date = new Date();
            var nowMonth = date.getMonth() + 1;
            var strDate = date.getDate();
            var seperator = "-";
            
            if (nowMonth >= 1 && nowMonth <= 9) {
            nowMonth = "0" + nowMonth;
            }

            if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
            }
            var hour=date.getHours(); 
            var minutes=date.getMinutes(); 
            var seconds=date.getSeconds();
            var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate+" "+hour+":"+minutes+":"+seconds;

            console.log(nowDate);
            var content={
                entry: todo,
                completed: false,
                priority:0,
                time:nowDate
              };
            data.items.splice(data.items.length-data.topping, 0, content);
        } 


        $('todo').addEventListener('keyup', function(event) {
            if (event.keyCode != 13) 
                return;
            addEntry();
            update();
          }); 
        $('add').addEventListener('click', function() {
            addEntry();
            update();
          });

        //filter
        $('all').addEventListener('click', function() {
            data.filter='ALL';
            update();
          });
        $('active').addEventListener('click', function() {
            data.filter='ACTIVE';
            update();
        });
        $('completed').addEventListener('click', function() {
            data.filter='COMPLETED';
            update();
        });

        //clear all completed
        $('clear_completed').addEventListener('click',function(){
            for(var i = data.items.length-1;i>=0;i--){
                if(data.items[i].completed){
                    data.items.splice(i,1);
                }
            }
            update(); 
        });

        //toggle all
        $('toggle_all').addEventListener('click',function(){
            if(toggle==0){
                data.items.forEach(function(entry,index) {
                    entry.completed=true;
                    toggle=1;
                });
            }
            else{
                data.items.forEach(function(entry,index) {
                    entry.completed=false;
                    toggle=0;
                });
            }
            update();
        });
        
        //change theme
        $('changeColor').addEventListener('click',function(){
            if(document.body.contains($('background'))){
                $('background').style.display="none";
            }
            if(document.body.contains($('color'))){
                if($('color').style.display=="none"){
                    $('color').style.display="block";
                    return 0;
                }
                else{
                    $('color').style.display="none";
                    return 0;
                }
            }
            
            var color=document.createElement("div");
            color.classList.add("color");
            color.setAttribute('id','color');
            color.innerHTML="Please choose color:";
            var title=$('h');
            var body=$('body');
            var bluebutton=document.createElement("button");
            var pinkbutton=document.createElement("button");
            var greenbutton=document.createElement("button");
            bluebutton.innerHTML="Blue";
            pinkbutton.innerHTML="Pink";
            greenbutton.innerHTML="Green";
            bluebutton.setAttribute('id','blueTheme');
            pinkbutton.setAttribute('id','pinkTheme');
            greenbutton.setAttribute('id','greenTheme');
            color.appendChild(bluebutton);
            color.appendChild(pinkbutton);
            color.appendChild(greenbutton);
            body.insertBefore(color,title);
            $('blueTheme').addEventListener('click',function(){
                setStyleSheet('blue');
                data.theme='blue';
                update();
            });
            $('pinkTheme').addEventListener('click',function(){
                setStyleSheet('pink');
                data.theme='pink';
                update();
            });
            $('greenTheme').addEventListener('click',function(){
                setStyleSheet('green');
                data.theme='green';
                update();
            });

            update();
        });

        //change background
        $('changeBg').addEventListener('click',function(){  
            if(document.body.contains($('color'))){
                $('color').style.display="none";
            }
            if(document.body.contains($('background'))){
                if($('background').style.display=="none"){
                    $('background').style.display="block";
                    return 0;
                }
                else{
                    $('background').style.display="none";
                    return 0;
                }
            } 
            
            var bg=document.createElement("div");
            bg.setAttribute('id','background');
            bg.innerHTML="Please choose color:";
            var title=$('h');
            var body=$('body');
            body.insertBefore(bg,title);
            var input=document.createElement("input");
            input.setAttribute('type','color');
            input.setAttribute('id','bg');
            bg.appendChild(input);
            $('bg').addEventListener('change',function(){
                document.body.style.background = this.value;
                console.log(this.value);
            });
            
            update();
        });

    });
    update();
};

function update(){
    model.flush();
    var data = model.data;
    data.topping='0';

    //show topping entry first
    data.items.forEach(function(entry,index) {
        if(entry.priority==1){
            number=Number(data.topping)+1;
            data.topping=String(number);
        }
    });

    var left=0;
    $('all').classList.remove("clicked");
    $('active').classList.remove("clicked");
    $('completed').classList.remove("clicked");
    $('boundary').innerHTML='';

    //theme
    if(data.theme=='pink'){
        setStyleSheet('pink');
    }
    if(data.theme=='blue'){
        setStyleSheet('blue');
        console.log("blue");
    }
    if(data.theme=='green'){
        setStyleSheet('green');
    }

    data.items.forEach(function(entry,index) {
        var item = document.createElement('div');
        item.className = 'entry';
        item.innerHTML=entry.entry;
        
        var itemDiv=document.createElement('div');
        var time=document.createElement('span');
        time.innerHTML=entry.time;
        time.className='time';
        itemDiv.appendChild(time);
        itemDiv.appendChild(item);
        if(entry.completed){
            item.classList.add("completed");
        }
        
        //render entries
        var Hammer_item = new Hammer(item);
        if(data.filter=='ALL'){
            if(!entry.completed){
                left=left+1;
            }
            if(entry.priority==1){
                item.classList.add("priority");
            }
            if($('boundary').childNodes.length){
                $('boundary').insertBefore(itemDiv, $('boundary').childNodes[0]);
            } 
            else{
                $('boundary').appendChild(itemDiv);
            }
            $('all').classList.add("clicked");    
        }
        if(data.filter=='ACTIVE'){
            if(!entry.completed){
                left=left+1;
                if(entry.priority==1){
                    item.classList.add("priority");
                }
                if($('boundary').childNodes.length){
                    $('boundary').insertBefore(itemDiv, $('boundary').childNodes[0]);
                } 
                else{
                    $('boundary').appendChild(itemDiv);
                }
            }
            $('active').classList.add("clicked");  
        }
        if(data.filter=='COMPLETED'){
            if(entry.completed){
                
                left=left+1;
                if($('boundary').childNodes.length){
                    $('boundary').insertBefore(itemDiv, $('boundary').childNodes[0]);
                } 
                else{
                    $('boundary').appendChild(itemDiv);
                }
            }
            $('completed').classList.add("clicked");  
        }
        //complete
        Hammer_item.on("tap", function () {
            $('clear_completed').style.visibility="visible";
            if(!entry.completed){     
                entry.completed=true;
                data.items.splice(index,1);
                data.items.unshift(entry);
                update();
            }
            else{
                entry.completed=false;
                data.items.splice(index,1);
                if(entry.priority==1){
                    data.items.splice(data.items.length-data.topping+1, 0, entry);
                    entry.priority=0;
                }
                else{
                    data.items.splice(data.items.length-data.topping, 0, entry);
                }
                update();
            }
         });
        
        //editing
        Hammer_item.on("press", function () {
            item.classList.add('editing');
            var edit = document.createElement('input');
            var finished = false;
            edit.setAttribute('type', 'text');
            edit.setAttribute('class', 'edit');
            edit.setAttribute('value',  item.innerHTML);
            
            function finish() {
            if (finished) return;
            finished = true;
            itemDiv.removeChild(edit);
            item.classList.remove('editing');   
            }
        
            edit.addEventListener('blur', function() {
            finish();
            }, false);
        
            edit.addEventListener('keyup', function(ev) {
            if (ev.keyCode == 27) { // Esc
                finish();
            } else if (ev.keyCode == 13) {
                item.innerHTML = this.value;
                entry.entry=this.value;
                finish();
            }
            }, false);
        
            itemDiv.appendChild(edit);
            edit.focus();
            
         });

         //swipe left to delete or topping
         Hammer_item.on("swipeleft", function () {
            if(item.classList.contains("entryleft")){
                return 0;
            }
            time.style.display="none";
            if(!entry.completed){
                item.classList.add("entryleft");
                item.classList.remove("entry");
                var delete_button=document.createElement("button");
                delete_button.classList.add("deletebutton");
                delete_button.innerHTML="Delete";
                itemDiv.appendChild(delete_button);
                if(entry.priority==1){
                    var down_button=document.createElement("button");
                    down_button.classList.add("canceltopping");
                    down_button.innerHTML="Cancel";
                    itemDiv.appendChild(down_button);
                    // cancel topping
                    down_button.addEventListener('click',function(){
                        data.items.splice(index,1);
                        data.items.splice(data.items.length-data.topping+1, 0, entry);
                        entry.priority=0;
                        item.classList.remove("priority");
                        update();
                    });
                }
                else{
                    var up_button=document.createElement("button");
                    up_button.classList.add("upbutton");
                    up_button.innerHTML="Topping";
                    itemDiv.appendChild(up_button);
                    //topping
                    if(!entry.completed){
                        up_button.addEventListener('click',function(){
                            data.items.push(entry);
                            data.items.splice(index,1);
                            entry.priority=1;
                            update();
                        });
                    }
                }
            }
            
            if(entry.completed){
                if(item.classList.contains("entryleft2")){
                    return 0;
                }
                item.classList.add("entryleft2");
                item.classList.remove("entry");
                var delete_button=document.createElement("button");
                delete_button.classList.add("deletebutton2");
                delete_button.innerHTML="Delete";
                itemDiv.appendChild(delete_button);
            }

             //delete
            delete_button.addEventListener('click', function() {
                
                data.items.splice(index,1);
                update();
            });
            
        
            itemDiv.addEventListener('blur', function() {
                itemDiv.removeChild("deletebutton");
                itemDiv.removeChild("upbutton");
                item.classList.add("entry");
                item.classList.remove("entryleft");
            }, false); 
         });
    });
    $('num').innerHTML=left;
}

