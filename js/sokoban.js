var LEVEL = window.LEVEL || {}

$(function () {
  LEVEL.initialize = function (textData) {
    var levelData = textData.split("\n")
      , temp = [];

    for (var n = 0; n < levelData.length; n++) {
      var line = levelData[n];
      temp.push(line.split(''))
    };

    levelData = temp;

    var numberFreeCrates = function (data) {
      var re = /o/g
        , matches = data.join('').match(re);
      
      if (matches) {
        return matches.length
      } else {
        return 0
      }
    };
    
    var gameOver = function () {
      var freeCrates = numberFreeCrates(this.levelData);

      if (freeCrates === 0) {
        return true
      } else {
        return false
      }
      
    };
    
    var movePlayer = function (dx, dy) {
      var playerPosition = findPlayer(this.levelData);
      var x = playerPosition[0]
        , y = playerPosition[1]
        , destination = this.levelData[y + dy][x + dx];
            
      switch(destination) {
        case '#':
          return true
        case 'o':
          crateDest = this.levelData[y + dy * 2][x + dx * 2]
          switch(crateDest) {
            case ' ':
              this.levelData[y + dy * 2][x + dx * 2] = 'o'
              break;
            case '.':
              this.levelData[y + dy * 2][x + dx * 2] = '*'
              break;
            default:
              return true
          }
          
          if (destination === 'o') {
            destination = ' '
          } else {
            destination = '.'
          }
          break;
        case '*':
          crateDest = this.levelData[y + dy * 2][x + dx * 2]
          switch(crateDest) {
            case ' ':
              this.levelData[y + dy * 2][x + dx * 2] = 'o'
              break;
            case '.':
              this.levelData[y + dy * 2][x + dx * 2] = '*'
              break;
            default:
              return true
          }
          
          if (destination === 'o') {
            destination = ' '
          } else {
            destination = '.'
          }
          break;
        default:
          
      }
      
      if (destination === ' ') {
        this.levelData[y + dy][x + dx] = "@"
      } else {
        this.levelData[y + dy][x + dx] = "+"
      }
      
      if (this.levelData[y][x] === '@') {
        this.levelData[y][x] = ' '
      } else {
        this.levelData[y][x] = '.'
      }
      
      return true
    };
    
    var findPlayer = function (data) {
      var result = [];

      for (var y = 0; y < data.length; y++) {
        var line = data[y]
          , a = line.indexOf("\@")
          , b = line.indexOf("\+")
          , x = (a > -1 ? a : b);

        if (typeof x !== 'undefined' && x >= 0) {
          return [x, y]
        }
      }
    };

    var showLevel = function () {
      var levelData = this.levelData
        , temp = [];
      
      for (var i = 0; i < levelData.length; i++) {
        var line = levelData[i].join('')
        temp.push(line);
      };
      
      return temp.join("\n")
    };

    return {
      levelData: levelData,
      textData: textData,
      move: movePlayer,
      show: showLevel,
      finished: gameOver
    }
    
  }
  
  var text = "                          #####\n\
                          #   #\n\
                          #o  #\n\
                        ###  o##\n\
                        #  o o #\n\
                      ### # ## #   ######\n\
                      #   # ## #####  ..#\n\
                      # o  o          ..#\n\
                      ##### ### #@##  ..#\n\
                          #     #########\n\
                          #######"

  var level = new LEVEL.initialize(text);
  
  function showLevelText (aLevel) {
    return "<pre id='level' style='font-size: 14pt;'><code>" + aLevel.show() + '</code></pre>'
  }
  
  var view = $(showLevelText(level));
  $('#container').append(view);

  view.bind('keydown', function(e) {
    console.log(e.keyCode);
  });

  var countFinish = 0;

  $(document).bind('keydown', function(e) {
    $('#level').remove();
    if (level.finished()) {
      if (countFinish < 1) {
        $('#container').append($('<p>Congratulations. You finished the level. Thanks for playing</p>'));
        countFinish += 1;
      }
    } else {
      switch(e.keyCode) {
        case 65:
          level.move(-1, 0);
          break;
        case 68:
          level.move(1, 0);
          break;
        case 82:
          level = new LEVEL.initialize(text);
          break;
        case 83:
          level.move(0, 1);
          break;
        case 87:
          level.move(0, -1);
          break;
      }
      $('#container').append($(showLevelText(level)));
    }
  });
})
