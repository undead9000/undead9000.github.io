const NUMS = 32;
const ROWS = 16;

let hero = new Hero(1, 3, 1, 1);
let monster = new Hero(1, 1, 1, 1);

$(document).ready(function(){
    $("a[data-row='3'][data-num='3']").addClass('hero');
    $("a[data-row='4'][data-num='6']").addClass('monster');

    updateInfo();

    $('#hexGrid').on('click', 'a.hero', function(e){
        e.preventDefault();
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            toggleHeroRadius(false, 1, $(this).data('row'), $(this).data('num'));
        } else {
            $(this).addClass('active');
            toggleHeroRadius(true, 1, $(this).data('row'), $(this).data('num'));
        }
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
        if($(this).hasClass('monster')) {
            getFight();
        }
    });    

    $('.hero .config_param.level select').on('change', function(){
        hero.level = $(this).val();
        let st = $('.hero .config_param.st option:selected').val();
        let ag = $('.hero .config_param.ag option:selected').val();
        hero = new Hero(hero.level, st, ag, 1);
        updateInfo();
    });

    $('.hero .config_param.st select').on('change', function(){
        hero.st = $(this).val();
        let level = $('.hero .config_param.level option:selected').val();
        let ag = $('.hero .config_param.ag option:selected').val();
        hero = new Hero(level, hero.st, ag, 1);
        updateInfo();
    });    

    $('.hero .config_param.ag select').on('change', function(){
        hero.ag = $(this).val();
        let level = $('.hero .config_param.level option:selected').val();
        let st = $('.hero .config_param.st option:selected').val();
        hero = new Hero(level, st, hero.ag, 1);
        updateInfo();
    });        

    $('.monster .config_param.level select').on('change', function(){
        monster.level = $(this).val();
        let st = $('.monster .config_param.st option:selected').val();
        let ag = $('.monster .config_param.ag option:selected').val();        
        monster = new Hero(monster.level, st, ag, 1);
        updateInfo();
    });    
    
    $('.monster .config_param.st select').on('change', function(){
        monster.st = $(this).val();
        let level = $('.monster .config_param.level option:selected').val();
        let ag = $('.monster .config_param.ag option:selected').val();
        monster = new Hero(level, monster.st, ag, 1);
        updateInfo();
    });    

    $('.monster .config_param.ag select').on('change', function(){
        monster.ag = $(this).val();
        let level = $('.monser .config_param.level option:selected').val();
        let st = $('.monster .config_param.st option:selected').val();
        monster = new Hero(level, st, monster.ag, 1);
        updateInfo();
    }); 
})

function Hero(level, st, ag, body){
    this.level = level;
    this.st = st;
    this.ag = ag;
    this.body = body;
    this.dmg = level * this.st;
    this.block = this.st * 5 / 100;
    this.dodge = this.ag * 5 / 100;
    this.hp = body * 10;
}

function updateInfo() {
    $('.hero .config_param.level select').val(hero.level);
    $('.hero .config_param.st select').val(hero.st);
    $('.hero .config_param.ag select').val(hero.ag);
    $('.hero .config_param.body').text(hero.body);
    $('.hero .config_param.dmg').text(hero.dmg);
    $('.hero .config_param.block').text(hero.block);
    $('.hero .config_param.dodge').text(hero.dodge);
    $('.hero .config_param.hp').text(hero.hp);

    $('.monster .config_param.level select').val(monster.level);
    $('.monster .config_param.st select').val(monster.st);
    $('.monster .config_param.ag select').val(monster.ag);
    $('.monster .config_param.body').text(monster.body);
    $('.monster .config_param.dmg').text(monster.dmg);
    $('.monster .config_param.block').text(monster.block);
    $('.monster .config_param.dodge').text(monster.dodge);
    $('.monster .config_param.hp').text(monster.hp);   
}

function toggleHeroRadius(active = true, radius = 1, x, y) {
    let temp_x = x;
    let temp_y = y;
    if(active) {
        temp_y = y - 1;
        if(temp_y > 0) {
            $("a[data-row='" + x + "'][data-num='" + temp_y + "']").addClass('accessible');
            //console.log('left:', x, temp_y);
        }

        temp_y = y + 1;
        if(x % 2 == 1 && temp_y <= NUMS) {
            $("a[data-row='" + x + "'][data-num='" + temp_y + "']").addClass('accessible');  
            //console.log('right1:', x, temp_y);
        }
        if(x % 2 == 0 && temp_y <= NUMS - 1) {
            $("a[data-row='" + x + "'][data-num='" + temp_y + "']").addClass('accessible');  
            //console.log('right2:', x, temp_y);
        }        

        temp_x = x - 1;
        if(temp_x > 0) {
            temp_y = y - 1;
            $("a[data-row='" + temp_x + "'][data-num='" + (temp_y + temp_x % 2) + "']").addClass('accessible');
            $("a[data-row='" + temp_x + "'][data-num='" + (y + temp_x % 2) + "']").addClass('accessible');
            //console.log("tops:", temp_x, temp_y);
            //console.log("tops:", temp_x, y);
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

function moveHero(x, y){
    $("a").removeClass('hero').removeClass('active');
    $("a[data-row='" + x + "'][data-num='" + y + "']").addClass('hero');
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getFight() {
    let hero_success = false;
    let monster_success = false;
    let random;

    console.log('Monster result');
    //монстр заблокировал удар?
    random = Math.random();
    if(monster.block < random) hero_success = true;
    console.log(monster.block, random, hero_success);

    //монстр увернулся?
    random = Math.random();
    if(monster.dodge < random) hero_success = true;
    console.log(monster.dodge, random, hero_success);

    if(hero_success) {
        monster.hp = monster.hp - hero.dmg;
    }

    console.log('Hero result');
    //игрок заблокировал удар?
    random = Math.random();
    if(hero.block < random) monster_success = true;
    console.log(hero.block, random, monster_success);

    //игрок увернулся?
    random = Math.random();
    if(hero.dodge < random) monster_success = true;
    console.log(hero.dodge, random, monster_success);

    if(monster_success) {
        hero.hp = hero.hp - monster.dmg;
    }    

    updateInfo();
}