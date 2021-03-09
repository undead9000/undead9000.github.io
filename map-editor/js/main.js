const NUMS = 32;
const ROWS = 16;

let hero = new Hero(1, 1, 1, 1);
let monster = new Hero(1, 1, 1, 1);

$(document).ready(function(){
  $("a[data-row='3'][data-num='3']").addClass('busy').addClass('hero');
  $("a[data-row='4'][data-num='6']").addClass('busy').addClass('monster');

  let current_map_element = $('.map_element option:selected').val();

  $('#hexGrid').on('click', 'a.hexIn', function(e){
    if($(this).hasClass('busy')) {
      $(this).attr('class', 'hexIn');
    } else {
      $(this).addClass('busy').addClass(current_map_element);
    }
  });

  $('.map_element select').on('change', function(){
    current_map_element = this.value;
  })

  $('.clear-sreen').on('click', function(e){
    e.preventDefault();
    Clear();
  });

  $('.export-map').on('click', function(e){
    e.preventDefault();
    Export();
  })

  /*$('#hexGrid').on('click', 'a.hero', function(e){
      e.preventDefault();
      $(this).removeClass('hero');
  });

  $("#hexGrid").on('click', 'a.accessible', function(e){
      e.preventDefault();
      if(!$(this).hasClass('monster')) {
          moveHero($(this).data('row'), $(this).data('num'));
          toggleHeroRadius(false, 1, $(this).data('row'), $(this).data('num'));
      }
  });

  $("#hexGrid").on('click', 'a.monster', function(e){
      e.preventDefault();
      $(this).removeClass('monster');
  });    */

  let inputElement = document.getElementById('import-map');
  inputElement.addEventListener('change', handleFiles, false);
})

function handleFiles() {
  const fileList = this.files;
  let file = fileList[0];


  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    Clear();
    let loadmap = JSON.parse(reader.result);
    loadmap.forEach(function(item, i, arr) {
      $("a[data-row='" + item.row + "'][data-num='" + item.num + "']").addClass('busy').addClass(item.type);
    });
  };

  reader.onerror = function() {
    console.log(reader.error);
  };
}

function Clear() {
  $('a.hexIn').attr('class', 'hexIn');
}

function Export() {
  let map = [];
  let last_class;
  $('#hexGrid .hex').each(function(index, item){
    if($(item).children().hasClass('busy')) {
      lastClass = $(item).children().attr('class').split(' ').pop();
      map.push({type: lastClass, row: $(item).children().data('row'), num: $(item).children().data('num')});
    }
  });
  downloadURL('data:text/plain;charset=UTF-8,' + escape(JSON.stringify(map)), 'map.txt');
}

var downloadURL = function(url, name) {
  var link = document.createElement('a');
  if(name == undefined || name == ''){name = url};
  link.setAttribute('href',url);
  link.setAttribute('download',name);
  onload = link.click();
};

function Hero(level, st, ag, body){
  this.level = parseInt(level);
  this.st = parseInt(st);
  this.ag = parseInt(ag);
  this.st_result = parseInt(level) + parseInt(st) - 1;
  this.ag_result = parseInt(level) + parseInt(ag) - 1;
  this.body = parseInt(body);
  this.dmg = parseInt(level) * this.st_result;
  //this.block = this.st_result * 5 / 100;
  this.block = 0.5;
  //this.block = this.st_result * 5 / 100;
  this.dodge = 0.5;
  this.hp = body * 10;

  this.wins = 0;
  this.ttk = 0;
}

function toggleHeroRadius(active = true, radius = 1, x, y) {
    let temp_x = x;
    let temp_y = y;
    if(active) {
        temp_y = y - 1;
        if(temp_y > 0) {
            $("a[data-row='" + x + "'][data-num='" + temp_y + "']").addClass('accessible');
        }

        temp_y = y + 1;
        if(x % 2 == 1 && temp_y <= NUMS) {
            $("a[data-row='" + x + "'][data-num='" + temp_y + "']").addClass('accessible');  
        }
        if(x % 2 == 0 && temp_y <= NUMS - 1) {
            $("a[data-row='" + x + "'][data-num='" + temp_y + "']").addClass('accessible');  
        }        

        temp_x = x - 1;
        if(temp_x > 0) {
            temp_y = y - 1;
            $("a[data-row='" + temp_x + "'][data-num='" + (temp_y + temp_x % 2) + "']").addClass('accessible');
            $("a[data-row='" + temp_x + "'][data-num='" + (y + temp_x % 2) + "']").addClass('accessible');
        }

        temp_x = x + 1;
        if(temp_x <= ROWS) {
            if(temp_x > 2) {
                $("a[data-row='" + temp_x + "'][data-num='" + (temp_y + temp_x % 2) + "']").addClass('accessible');
                $("a[data-row='" + temp_x + "'][data-num='" + (y + temp_x % 2) + "']").addClass('accessible');
            } else {
                $("a[data-row='" + temp_x + "'][data-num='" + (temp_y - 1) + "']").addClass('accessible');
                $("a[data-row='" + temp_x + "'][data-num='" + (y - 1) + "']").addClass('accessible');                
            }         
        }
    } else {
        $("a").removeClass('accessible');
    }
}
