var actionsheet, actionsheetstatus = 0;
var myApp = angular.module('calendarChurch', ['ionic', 'ngAnimate', 'ui.rCalendar'])
  .run(function ($ionicPlatform, $animate) {
    $animate.enabled(false);
    $ionicPlatform.registerBackButtonAction(function (e) {
      if (actionsheetstatus === 1) {
        actionsheet();
        actionsheetstatus = 0;
      } else {
        //e.preventDefault();
        ionic.Platform.exitApp();
      }
      return false;
    }, 101);

  })
  .factory('Events', function () {
    return {
      all: function () {
        var eventString = window.localStorage['events'];
        if (eventString) {
          return angular.fromJson(eventString);
        }
        return [];
      },
      save: function (events) {
        window.localStorage['events'] = angular.toJson(events);
      }

      /*
      newProject: function(projectTitle) {
        // Add a new project
        return {
          title: projectTitle,
          tasks: []
        };
      },
      getLastActiveIndex: function() {
        return parseInt(window.localStorage['lastActiveProject']) || 0;
      },
      setLastActiveIndex: function(index) {
        window.localStorage['lastActiveProject'] = index;
      }*/
    }
  })
  .factory('Studies', function () {
    return {
      all: function () {
        var studyString = window.localStorage['studies'];
        if (studyString) {
          return angular.fromJson(studyString);
        }
        return [];
      },
      save: function (studies) {
        window.localStorage['studies'] = angular.toJson(studies);
      },
      getContent: function (id) {
        var studyString = window.localStorage['studies'];
        if (studyString) {
          var studiesJson = angular.fromJson(studyString);
          for (var i = studiesJson.length - 1; i >= 0; i--) {
            if (studiesJson[i].idStudy == id) {
              return studiesJson[i].content;
            }
          }
        }
        return '';
      },
      setContent: function (id, content) {
        var studyString = window.localStorage['studies'];
        if (studyString) {
          var studiesJson = angular.fromJson(studyString);
          for (var i = studiesJson.length - 1; i >= 0; i--) {
            if (studiesJson[i].idStudy == id) {
              studiesJson[i].content = content;
            }
          }
          window.localStorage['studies'] = angular.toJson(studiesJson);
        }
      }
    }
  })


  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $urlRouterProvider.otherwise('/tab/event');
    $stateProvider
      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      .state('tabs.event', {
        url: '/event',
        views: {
          'event-tab': {
            templateUrl: 'templates/event.html',
            controller: 'CalendarCtrl'
          }
        }
      })
      .state('tabs.studies', {
        url: '/studies',
        views: {
          'studies-tab': {
            templateUrl: 'templates/studies.html',
            controller: 'StudyCtrl'
          }
        }
      })
      .state('tabs.studies12', {
        url: '/studies12',
        views: {
          'studies12-tab': {
            templateUrl: 'templates/studies12.html',
            controller: 'StudyCtrl12'
          }
        }
      })
      .state('study', {
        url: '/study/:idStudy?title?date',
        templateUrl: 'templates/study.html',
        controller: 'StudyCtrlItem'
      });

  })
  .controller('StudyCtrlItem', function ($scope, $stateParams, $http, $ionicPopup, $ionicActionSheet, $ionicLoading, Studies) {
    $scope.studySelect = {};
    $scope.studySelect.idStudy = $stateParams.idStudy;
    $scope.studySelect.date = $stateParams.date;
    $scope.studySelect.title = $stateParams.title;
    $scope.studySelect.content = '';
    $scope.studySelect.content = $scope.studySelect.content.concat('<div class="div-date-study"><p>Nº ' + $scope.studySelect.idStudy + '</p></div>');
    $scope.studySelect.content = $scope.studySelect.content.concat('<div class="div-title-study"><p>' + $scope.studySelect.title + '</p></div>');
    /*$scope.studySelect.content = $scope.studySelect.content.concat(
        '<p style="text-align: justify;"><em>“Bem-aventurados os humildes de espírito porque deles é o reino dos céus.” (Mateus 5:3).</em></p>'+
        '<p style="text-align: justify;">Na primeira parte deste estudo, aprendemos que Jesus é nosso Exemplo maior de humildade. Ele nos ensinou o caminho da humildade para que nós, como filhos de Deus, possamos andar em humildade. Este foi também o pedido do Apóstolo Paulo aos cristãos. <em>“Rogo-vos, pois, eu, o preso do Senhor, que andeis como é digno da vocação com que fostes chamados, com toda a humildade e mansidão, com longanimidade, suportando-vos uns aos outros em amor.” (Efésios 4:1,2)</em></p>'+
        '<p style="text-align: justify;"><strong>Jesus, a Humildade na Terra</strong></p>'+
        '<p style="text-align: justify;">Jesus nos ensinou o maior ato de humildade quando lavou os pés dos discípulos. Naquele ato, ensinou sobre como nossa liderança deve ser pautada no serviço e na humildade. <em>“Levantou-se da ceia, tirou as vestes, e, tomando uma toalha, cingiu-se. Depois deitou água numa bacia, e começou a lavar os pés aos discípulos, e a enxugar-lhos com a toalha com que estava cingido... Depois que lhes lavou os pés, e tomou as suas vestes, e se assentou outra vez à mesa, disse-lhes: Entendeis o que vos tenho feito? Vós me chamais Mestre e Senhor, e dizeis bem, porque eu o sou. Ora, se eu, Senhor e Mestre, vos lavei os pés, vós deveis também lavar os pés uns aos outros. Porque eu vos dei o exemplo, para que, como eu vos fiz, façais vós também. Na verdade, na verdade vos digo que não é o servo maior do que o seu senhor, nem o enviado maior do que aquele que o enviou. Se sabeis estas coisas, bem-aventurados sois se as fizerdes.” (João 13:4,5,12-17)</em></p>'+
        '<p style="text-align: justify;">O ato de Jesus e as Suas palavras foram claros quanto à humildade, porque a humildade é preciosa aos olhos de Deus, como relata I Pedro 3:4, que diz:<em> “Mas o homem encoberto no coração; no incorruptível traje de um espírito humilde e tranquilo, que é precioso diante de Deus.”</em> A graça de Deus nos faz dignos e valiosos por aquilo que somos e não por aquilo que realizamos em sucesso. Não devemos querer plantar o nosso reino, mas entrar no Reino de Deus e cumprir os princípios de humildade, parecendo-nos com Jesus.</p>'+
        '<p style="text-align: justify;"><strong>Humildade, obedecer em santidade</strong></p>'+
        '<p style="text-align: justify;">Só existe um caminho que nos leva à humildade: a obediência santa. A humildade é um princípio espiritual, é a introdução de um ministério de sucesso, de êxito.<em> “Bem-aventurados os humildes de espírito, porque deles é o reino dos céus.” (Mateus 5:3)</em></p>'+
        '<p style="text-align: justify;">Ser humilde de espírito não representa anular sua personalidade, seu temperamento; não é autonegação, fazer voto de pobreza, viver enclausurado, sendo miserável. Também não quer dizer impressionar os outros com uma falsa humildade, querendo mostrar que é o que não é.</p>'+
        '<p style="text-align: justify;">Deus, em toda a Palavra, nunca associou humildade com pobreza, no que se refere à miséria. Há pessoas que associam humildade à pobreza ou às pessoas que passam por necessidades. Mas não encontramos nenhum registro bíblico que diga que devemos ser pobres ou passar necessidades para sermos humildes. O que ocorre é que nossos conceitos são errados.</p>'+
        '<p style="text-align: justify;">Miséria tem a ver com o diabo e não com o nosso Deus. Quando nossa visão é plena da santidade de Deus, tudo o que é mesquinho, egoísta, obra da carne, sai da nossa vida para dar lugar às características do Reino.</p>'+
        '<p style="text-align: justify;">A humildade é uma chamada para todo cristão. Precisamos ter um coração humilde, contrito na presença do Senhor, para agradá-lO. Isso não significa que, dentro da Igreja, faremos parte de uma classe específica para os humildes, porque ela não existe.</p>'+
        '<p style="text-align: justify;"><strong>Humildade, um exercício diário</strong></p>'+
        '<p style="text-align: justify;">O exercício da humildade é um exercício que precisa ser diário na nossa vida. A humildade nos leva à cura dos sentimentos, à cura dos pensamentos, a ter um estilo de vida melhor, apropriado ao que a Palavra diz que tem que ser.</p>'+
        '<p style="text-align: justify;">Nos ensinamentos de Jesus, para o homem ter sucesso em sua trajetória de vida, precisa conhecer o ministério da humildade. Foi o que o Mestre ensinou aos discípulos enquanto esteve com eles.</p>'+
        '<p style="text-align: justify;">Os discípulos deram muito trabalho a Jesus, porque eram rudes, grossos, duros de coração, orgulhosos, invejosos, presunçosos, mas Jesus forjou o caráter de cada um, antes de enviá-los às nações. Podemos lembrar-nos de muitas ocasiões em que os discípulos tomaram uma postura contrária a que o Senhor lhes ensinava. Mas Jesus foi tratando com cada um, com cada situação e os fez conquistar as nações. Porque o homem humilde conquista os céus e a terra. Aleluia!</p>'+
        '<p style="text-align: justify;">Os humildes conquistam o reino dos céus e os mansos conquistam a terra, é o que está escrito em Mateus 5:3-5. A humildade e a simplicidade são as metas para que a cura do céu se estabeleça na terra.<br />Para ter humildade, é preciso abrir mão da autossuficiência. Isso é um exercício diário, porque muitas vezes fomos ensinados, até pelos nossos pais, que podemos resolver tudo sozinhos, o que não é verdade. Ser autossuficiente só destrói a base e o valor principal que é a família. Observe que quando os pais não são bons acolhedores para os filhos, no futuro, são rejeitados por eles; é por isso que muitos têm terminado suas vidas nos asilos.</p>'+
        '<p style="text-align: justify;">Jesus, ao formar Seus 12, começou pela humildade, porque Ele é a encarnação da humildade. Deus não exalta a pobreza, mas estimula a humildade. Aprendemos que o discípulo deve ser igual ao Mestre. O Mestre foi humilde.<em> “O discípulo não é superior a seu mestre, mas todo o que for perfeito será como o seu mestre.” (Lucas 6:40)</em></p>'+
        '<p style="text-align: justify;">Para entrar no caminho do Senhor, é necessário rasgar as vestes do orgulho, da soberba, da arrogância, da altivez... É renunciar o EU, é nos humilharmos, é aprendermos a ser humildes como o Senhor foi e como Ele quer que sejamos.</p>'+
        '<p style="text-align: justify;">Se você deseja ser líder, na Igreja ou no secular, deve exercer liderança com humildade, pois o líder precisa ser humilde e ensinar a humildade para outros. O líder humilde está sempre comprometido com a verdade.</p>'+
        '<p style="text-align: justify;">Seja humilde! O humilde é consumido pela glória de Deus. A glória de Deus é o ápice da humildade. Jesus ministrava humildade em todo o lugar. A humildade estava materializada em Jesus em todas as Suas conquistas.</p>'+
        '<p style="text-align: justify;">Há falta de referencial de humildade na Terra, mas nós podemos e faremos a diferença. Precisamos ser referencial de humildade, matar o nosso ego a cada momento.</p>'+
        '<p style="text-align: justify;">A rota da excelência é a humildade. Muitos ministérios já caíram por causa do orgulho, pela falta de humildade. Mas nós fazemos parte da geração que trilha o caminho da humildade e alcança a cura.</p>');
        */
    var contentTemp = Studies.getContent($scope.studySelect.idStudy);
    if (!contentTemp) {
      getContentStudy(true, $scope.studySelect.idStudy);
    } else {
      $scope.studySelect.content = $scope.studySelect.content.concat(contentTemp);
    }


    function getContentStudy(showLoad, id) {
      if (showLoad) {
        $scope.$parent.showLoading('conteúdo');
      }
      var baseUrl = "http://calendar.italo.site/calendarChurch/rest/study/" + id;
      //var baseUrl = "http://192.175.112.170:13225/calendarChurch/rest/study/"+id;
      //var baseUrl = "http://localhost:8080/calendarChurch/rest/study/"+id;
      $http.get(baseUrl, { timeout: 30000 }).then(function (response) {
        var responseText = response.data;
        Studies.setContent(id, responseText.content);
        console.log(responseText.content);
        $scope.studySelect.content = $scope.studySelect.content.concat(responseText.content);
        if (showLoad) {
          $scope.$parent.hideLoading();
        }
      }, function (err) {
        //$scope.studies = Studies.all();
        //showPopupNotification($scope.calendar.eventSource,'Teste');//teste
        if (showLoad) {
          $scope.$parent.hideLoading();
        }
        console.log(err);
      });
    };
  })

  .controller('StudyCtrl', function ($scope, $stateParams, $http, $ionicPopup, $ionicActionSheet, $ionicLoading, Studies) {
    /*$scope.studies = {'list' : [{'id':1,'number':215,'title':'Humildade, o caminho de excelência para a cura - Parte Final','content':'Nesse estudo 215 vamos falar...'},
                                {'id':2,'number':216,'title':'Teste 2','content':'Nesse estudo 216 vamos falar...'},
                               ]
                      };*/
    //$scope.studies = $scope.$parent.studies;


  })
  .controller('StudyCtrl12', function ($scope, $stateParams, $http, $ionicPopup, $ionicActionSheet, $ionicLoading, Studies) {
    /*$scope.studies = {'list' : [{'id':1,'number':215,'title':'Humildade, o caminho de excelência para a cura - Parte Final','content':'Nesse estudo 215 vamos falar...'},
                                {'id':2,'number':216,'title':'Teste 2','content':'Nesse estudo 216 vamos falar...'},
                               ]
                      };*/
    //$scope.studies = $scope.$parent.studies;


  })

  .controller('MainCtrl', function ($scope, $http, $ionicPopup, $ionicActionSheet, $ionicLoading, Events, Studies) {
    var baseUrl = "http://calendar.italo.site/calendarChurch/rest/";
    //var baseUrl = "http://localhost:8081/calendarChurch/rest/";
    //var baseUrl = "http://192.175.112.170:13225/calendarChurch/rest/";
    //var baseUrl = "http://192.168.43.232:8080/calendarChurch/rest/";
    //var baseUrl = "https://api.myjson.com/bins/9zilx";

    $scope.calendar = {};
    $scope.calendar.eventSource = Events.all();
    if (isEmptyObject($scope.calendar.eventSource)) {
      updateEvents(true);
    }

    $scope.studies = Studies.all();
    if (isEmptyObject($scope.studies)) {
      updateStudies(true);
    }

    $scope.actionSheet = showActionSheet;
    $scope.showLoading = showLoading;
    $scope.hideLoading = hideLoading;

    function showLoading(str) {
      $ionicLoading.show({
        template: 'Atualizando ' + str + ' ...'
      });
    };
    function hideLoading() {
      $ionicLoading.hide();
    };

    function showActionSheet() {
      actionsheetstatus = 1;
      actionsheet = $ionicActionSheet.show({
        buttons: [
          { text: '<i class="icon ion-refresh"></i> Atualizar programação' },
          { text: '<i class="icon ion-refresh"></i> Atualizar estudos' }
        ],
        buttonClicked: function (index) {
          if (index === 0) {
            updateEvents(true);
          }
          if (index === 1) {
            updateStudies(true);
          }
          return true;
        }

      });
    };
    function updateStudies(showLoad) {
      if (showLoad) {
        showLoading('estudos');
      }
      $http.get(baseUrl + 'study/all', { timeout: 30000 }).then(function (response) {
        var responseText = response.data;
        Studies.save(responseText.studies);
        console.log(responseText.studies);
        $scope.studies = responseText.studies;
        if (showLoad) {
          hideLoading();
        }
      }, function (err) {
        $scope.studies = Studies.all();
        //showPopupNotification($scope.calendar.eventSource,'Teste');//teste
        if (showLoad) {
          hideLoading();
        }
        console.log(err);
      });
    };
    function updateEvents(showLoad) {
      if (showLoad) {
        showLoading('programação');
      }
      $http.get(baseUrl + 'event', { timeout: 30000 }).then(function (response) {
        var responseText = response.data;
        console.log(responseText);
        Events.save(responseText.objs);
        console.log(responseText.objs);
        $scope.calendar.eventSource = responseText.objs;
        if (showLoad) {
          hideLoading();
        }
      }, function (err) {
        $scope.calendar.eventSource = Events.all();
        if (showLoad) {
          hideLoading();
        }
        console.log(err);
      });
      //showPopupNotification($scope.calendar.eventSource,'Teste');//teste
      //$scope.calendar.eventSource = getEvents();
    };
    function isEmptyObject(obj) {
      var name;
      for (name in obj) return false;
      return true;
    };
  })

  .controller('CalendarCtrl', function ($scope, $http, $ionicPopup, $ionicActionSheet, $ionicLoading, Events) {
    //$scope.calendar  = $scope.$parent.calendar;


    ionic.Platform.ready(function () {
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
        if (window.plugins != undefined) {
          var notificationReceivedCallback = notification;
          var notificationOpenedCallback = notification;
          function notification(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            //alert("Notification opened:\n" + JSON.stringify(jsonData.notification.payload.additionalData.objs));
            if (jsonData.notification.payload.additionalData.typeNotification == 'Evento') {
              showPopupNotificationEvent(jsonData.notification.payload.additionalData.objs, jsonData.notification.payload.body);
              updateEvents(false);
            }
            if (jsonData.notification.payload.additionalData.typeNotification == 'Estudo') {
              showPopupNotificationStudy(jsonData.notification.payload.additionalData.objs, jsonData.notification.payload.body);
              updateStudies(false);
            }
          };

          // TODO: Update with your OneSignal AppId and googleProjectNumber before running.
          window.plugins.OneSignal
            .startInit("95e7da8a-7f6b-489d-9db8-61fe439d6a92")
            .handleNotificationOpened(notificationOpenedCallback)
            //.handleNotificationReceived(notificationReceivedCallback)
            .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
            .endInit();
        } else {
          console.log(window.plugins);
        }
      }

    });

    //$scope.loadEvents = updateEvents(true);

    $scope.onEventSelected = function (event) {
      //console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title + ',' + event.obs);
      showPopup(event);
    };

    $scope.onViewTitleChanged = function (title) {
      $scope.viewTitle = title;
    };
    $scope.today = function () {
      $scope.calendar.currentDate = new Date();
    };

    $scope.isToday = function () {
      var today = new Date(),
        currentCalendarDate = new Date($scope.calendar.currentDate);

      today.setHours(0, 0, 0, 0);
      currentCalendarDate.setHours(0, 0, 0, 0);
      return today.getTime() === currentCalendarDate.getTime();
    };

    $scope.onTimeSelected = function (selectedTime, events, disabled) {
      console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0) + ', disabled: ' + disabled);
    };

    function showPopupNotificationEvent(events, title) {
      //var utcStartTime = new Date(year, month, day, hours, minutes, 0, 0),
      //utcEndTime = new Date(event.endTime);
      $scope.events = events;
      console.log(events);
      var customTemplate =
        '<ion-list>' +
        '<ion-item class="item item-text-wrap" ng-repeat="event in events">' +
        '<h3 class="popup-title">{{event.dsEvent}}</h3>' +
        '<h5 class="popup-sub-title">' +
        '{{ (event.dtStart.dayOfMonth < 10 ? \'0\' : \'\') + event.dtStart.dayOfMonth +\'/\'+  (event.dtStart.month < 9 ? \'0\' : \'\') + (event.dtStart.month+1) + \'/\' + event.dtStart.year +\' \'+ (event.flAllDay ? \'Dia todo\' : (event.dtStart.hourOfDay < 10 ? \'0\' : \'\') + event.dtStart.hourOfDay+\':\'+ (event.dtStart.minute < 10 ? \'0\' : \'\') + event.dtStart.minute +\' - \'+(event.dtFinish.hourOfDay < 10 ? \'0\':\'\') + event.dtFinish.hourOfDay+\':\'+ (event.dtFinish.minute < 10 ? \'0\':\'\') + event.dtFinish.minute )}}' +
        '</h5>' +
        '</ion-item>' +
        '</ion-list>';

      $ionicPopup.show({
        template: customTemplate,
        title: title,
        cssClass: 'popup-notification',
        subTitle: 'Fique por dentro',
        scope: $scope,
        buttons: [
          { text: 'Sair', type: 'button-positive' }
        ]
      });

    }
    function showPopupNotificationStudy(studies, title) {
      //var utcStartTime = new Date(year, month, day, hours, minutes, 0, 0),
      //utcEndTime = new Date(event.endTime);
      $scope.studies = studies;
      console.log(studies);
      var customTemplate =
        '<ion-list>' +
        '<ion-item class="item item-text-wrap" ng-repeat="study in studies">' +
        '<h3 class="popup-title">{{ \'Estudo de célula -\' + study.idStudy}}</h3>' +
        '<h5 class="popup-sub-title">' +
        '{{study.dsTitle}}' +
        '</h5>' +
        '</ion-item>' +
        '</ion-list>';

      $ionicPopup.show({
        template: customTemplate,
        title: title,
        cssClass: 'popup-notification',
        subTitle: 'Fique por dentro',
        scope: $scope,
        buttons: [
          { text: 'Sair', type: 'button-positive' }
        ]
      });

    }

    function showPopup(event) {
      var utcStartTime = new Date(event.startTime),
        utcEndTime = new Date(event.endTime);
      var myPopup = $ionicPopup.show({
        //template: '<input type="password" ng-model="data.wifi">',
        template: "<span>" + event.obs + "</span>",
        title: event.title,
        subTitle: event.allDay ? 'Dia todo' : utcStartTime.toLocaleTimeString().substr(0, 5) + ' - ' + utcEndTime.toLocaleTimeString().substr(0, 5),
        scope: $scope,
        buttons: [
          { text: 'Sair', type: 'button-positive' }
          /*{
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          }*/
        ]
      });
      /*
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
  
      $timeout(function() {
         myPopup.close(); //close the popup after 3 seconds for some reason
       }, 3000);*/
    };

    function showPopupTest() {
      var myPopup = $ionicPopup.show({
        //template: '<input type="password" ng-model="data.wifi">',
        template: '<span>Teste</span>',
        title: 'Title',
        subTitle: 'Test subtitle',
        scope: $scope,
        buttons: [
          { text: 'Sair', type: 'button-positive' }
          /*{
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          }*/
        ]
      });
      /*
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
      
      $timeout(function() {
         myPopup.close(); //close the popup after 3 seconds for some reason
       }, 3000);*/
    };


    function getEvents() {
      var request = new XMLHttpRequest();
      request.open("GET", "../data/events.json", false);
      request.send(null);
      var events = [];
      var parsed = JSON.parse(request.responseText);
      for (var x in parsed.events) {
        events.push(parsed.events[x]);
      }
      return events;
    }

    function createRandomEvents() {
      var events = [];
      for (var i = 0; i < 1; i += 1) {
        var date = new Date();
        var eventType = Math.floor(Math.random() * 2);
        var startDay = Math.floor(Math.random() * 90) - 45;
        var endDay = Math.floor(Math.random() * 2) + startDay;
        var startTime;
        var endTime;
        if (eventType === 0) {
          startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
          if (endDay === startDay) {
            endDay += 1;
          }
          endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
          events.push({
            title: 'All Day - ' + i,
            startTime: startTime,
            endTime: endTime,
            allDay: true
          });
        } else {
          var startMinute = Math.floor(Math.random() * 24 * 60);
          var endMinute = Math.floor(Math.random() * 180) + startMinute;
          startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
          endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
          events.push({
            title: 'Event - ' + i,
            startTime: startTime,
            endTime: endTime,
            allDay: false
          });
        }
      }
      console.log(events);
      return events;
    }
  });