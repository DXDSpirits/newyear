
(function initPlayer() {
    var width = $(window).width();
    var height = width * 1.6;
    var zoom = Math.min(1, $(window).height() / height);
    var playerParams = {
        zoom: zoom,
        width: width,
        height: height,
        autoPlay: true,
        repeat: true,
        controlsEnabled: false
    };
    var WRAPPER_ID = 'loadingscreen-canvas-wrapper';
    var wrapper = document.getElementById(WRAPPER_ID);

    wrapper.style.width = width + 'px';
    wrapper.style.height = height + 'px';

    var animation = {"meta":{"id":"07dbac56ad62dc2429d5fff5","created":1454168838373,"modified":1454168838373,"author":"Jing Zhu","name":"Laoding1-375","authorUsername":"Jing.Zhu-897566530","description":"","duration":19.2,"numberOfScenes":1,"projectAccess":{"visibility":"PUBLIC","writeAccess":[],"readAccess":["PUBLIC"]}},"anim":{"dimension":[375.0,600.0],"framerate":24.0,"loop":false,"paths":["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\nJ2idTsVAnqJ2P3WHMrzrBMRgIwEYEIhBpaWF1g==","HpoE0ITJtKlm58WBDGfygZioJADFJYxWW64NIQCY","HmWFGuyEFTQgpiENGlHWgSF4sUFy5ygmUlXwK0pJTtlNKp6kuvBSdWhKRO9ksPdKY34Ja/flMWLEDZ6pZ3K8eYE8eaKJObZR\nAU6pUKeUHNISg1pBfQLmKrTKJVB4QqIxzVO2BSrDzBUdX6ql+YlQ5vC6LhAVgDzysoaBYlUjqmZQ5Usqaurg81grTZKBZhVH\nkvqkDTpCATA=","Hn71nGy24jQWsdhy3nC2ltRE6xCsGBbIciS1z5nWneNiw5SlmBLXMLpZuFdpqYTULn5ppe2t4zYCHWZq1AO2VXvHbtoQuzPP\nYXG7krVDbYgJKZAeEC22Ah7Y+E75MvI+9XCywbLIhCplYwjjMqXM2BMp4TA1W0WO+CBMWECGlzRPUzmJIVfyXIzfqi4tyUAI\nMNKC1fEIBMA=","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\njjdPGQbM2NDYGwNhCIQaOwsE4A==","HMkSIHMvkx3ZgY+wxD0aKW24prDW7R10KrshAJg=","HISK4pHVtjq2J1bCSm1Qd2eSHnlJDLYT7XGlgJuUiRsJY1QSzZ1JW1SQ/aSkF+qU+nvrc8KhfkJxSvavNPavShhvqSU4wltx\npIjh0kQxNXB0gmUXOTBq4qyBLVgGtyZle1Wxq6YnvJVi9SqGwoVrCfStzQ5QwL0q8zTlXabCpJKBQOMlJB79Sm30lUMtCATA\n","HlLhDTS0giJU5r+rT6HaWioMy1dA/Wg3cEp5LzWZ21Swk3QlhgpCqKdFVO0VzFdfvWHuyns5gsSmciVmNum9PmZ/q6TPgrBG\naOTzMn5BgmVoApsn2WIYoknLLp99RdgMwrmmK2XJYXLN0kslhkZxMCKRzYnIFQtzIWJd7CgL3gvRf3kqTPkniWsFRVTDR5JE\nIBM=","JsHiQWSqxTAACUkwAMQIYPabqYNqsibtS3m6sAAUxmZGpQLmokldIQATNHJFWWOTUskSo7W3WPkc2RQk6dimLP7+DUjxl3Pk\n62zQACmJhuavrG6gkZqKgAA5Al6z3L1Gs8rABWibUKAAMqHuuaAAusTBur+mJO78Md/AAlAA3SluN5a5AATUVAABqBP24x3/\nbFY+OG8pbwAmJOAALZYbpZu26KQA3pmji4zLq1MWUfpNzgABJ4busSbtusAAJl/FZ7N/og2gALGE3ECyybNNTCOuHhlhbIoF\nMTrPQAAbNO3XNzVXW5k0sirebUrxwABYwTxTDXnnJFcgC5n5wa5qmHWe1Hh0fY7/7atUwil1alwALAALr0aAEw==","JpJZATsctJQAGFLt2NFyN2ZiTgADFxWoWm6mokwt9AloyxFQ0bm1BmElKYtDdI82hKmV60AAmEWkVGD6lvACWkoADhcW5neJ\nPrmZOIE7PVpg6qqxAzbFYUu3XN9tJ0G9IU5rdsic2f1ClVq7ehVV2UfgAKpGACdejXWDtC6uHdyJUKqqRgAmgAFfDcQLdh2I\nAhcTdaCvhvWlcU0AAwcWAAN1q5GqYUyIATLYwAG7+aO7vI2jsVgArROAAKhRw5lMEOObYfxeJhbIYpb0jWIoAAIQCYA=","JP11BLULHxwAJimAADSA6TxwXKk7qpGbtcG5vJk8AAIFF3bGsattkMH13Wcg5LA3lMZgACBK78MqZf0SeqkYAJlaHIzeINL9\n3trWcsA+TmP1cAAVnSLAJg==","JL0fhcnzVepTFrrYUu5J6AAJyFyEotXEkUWMtMrzU5ydFpOl8m4AAVV1gADB00AA3YbsXXptsZpzZuaZFK2Toj0dWeEm8oAG\n6XWcbzK0AAFdZ+RSgAbpl1hAzbrIkxTI5EryOphVI4AK6z1oVgArRMLgpAa4jwbuZZdjCcoYYgTihu75cAAWes0ABEAZmnD8\nyakABTIwAtnxCmF0pWAAKsjkVVkbdqZGAFlaHIq4AATC5vthuw3ms1HbrQZXzL9FMGYiPAN5Fpz1Tct0tAAKYpgAC4y6zreZ\nWgABMthyJd6QXWTvtuDWVgArRMAAkVcJx0K7xOjXm5u/S6yzf+fFYAJGK28VpQgEwA==","JJCxhT+K1MgAmi4FfDCTleFNyAExuwABxFOhevFMaF2nkLlNUOIYF/VoABJurrOphTIwBNsX6PWWOwbtAAWMF3PjWcy7ZAAZ\nBwbu2V4brWyJ+tE3fsgVZUM1EyRVTCZfo8A3mqilb21TmqZG3llaAAE3NNftbzVuJNAAWMJwABNOuKFobR5Q1uZk4gSvQ2kD\nKX7AAKO0IOIp1oJcFMtak32wwfZ0i1GqR0nWgAEU6zyNutcmFhTCx8gACfzTqvI7jKq7VSOACqR5IUyMAIQdus0v2A==","IrIFFkrLSYABimDB7UCzBtY3WABOQJQABq0Fsg4ZbbHFoph8qsAAfJmgAFxre/CFtl/SmCsACmJ1nqpiuvQimRsZUAAsg3G6\nnUvwAA2FtWedv3VnK0ABZ8nAAEUm5Alg13oFK+NqZFJFgAF16tu8jEIQ5glyQpi4DdbUUpFVq40N1Md9AAak93XNV8XW5rB+\nfC4YMr0XAAEdxO7X685uRWvO22SAAmTTgALmq3VgADdc7bDSd3Z8ic47ECUxl3WgrRoQgM+0beY=","HpTlEYzHfAAGMHsHtJPMG1wAArRLwiiioF35Gg5rAAGDF/MFTC0ys83ddaXgMAAQGVN0byxuwACar0AAORTuoZy9XqETU5wJ\nRidAuawAJMWAAIpTKz1xmwHyvTpXkUwVZE3Sys/kZdS/BTE64c5qG3D687QAEieaAAsZuJzp3t5OfsYU4SbtiWiUJpzAAJFF\nmtM+KyfIpeZo5bKvScQlgAo4rbpkZCAT","JFJ5ov1JaAl+ilMsAsf1/ykYt/6QbloAy6wq/qxloA+n0rAZHpQmACv/Tf1gAzJ6z9Z95X+ZecwABnRn7jOjAIWb5YD24r/q\n4dYWmuoQf+95tSr/k55b/uWAqgMT9b/xRQLQBj5WWA5tKwAN9WFpqKRgl+plSsBkgl/xk1M/fmMYBPMiwAKYxWBuhiwC2CJZ\n/1NirAHGtRbgCEFoFAAr/w1tb/sWCKgLTZb/0RSLQBL5iWA9wi/+uQWF5tKVIJfopLrAfGVf7o/zP4pkWASTIsAAmLVgXoSs\nAwgiWf7zYqwCyuUWoAhB/1PUE8z9+ZFgE8yjAAJiFYF6FLALYJFn+81ysA0WFFqAK/6OxW/8VgioCU/W/8kUa0AS+PlgMbMs\nADeFhYaWlSCX6yV6wGSGX/GTqEE1MLTP35kWASTGMAAmLVgYoasAtgkWf9zXKwCxDUWoAr/o8lb/xWAqgJT9b/yRRrQBj5WW\nAxrSwANsWFRpCVgJfrpdrAXItf75TIQWrT1kz9+YxgE8x7AAJi1YFaGrALYIln/U1ysAsnFFoAK/6NuW/9FgyoCE9W/8UUS0\nAY+VlgPb2sADjVhea6kYJfqJNLAdHBf75EoQb+yU2YA=","IqFncskvAADJXVsD/6rYMANeAAJtSsn0AAAm","Iqe9b49KACLlUNQaouACVFYAKoRfVAA6SwABnRY1EAAsAAmMQgEw","IrXgXnjLABLpdiqmrmr5OQNxqA+DQAQksAEa10SosuNwAJdtAALv6TZVsufKtmMV392Uu2oAJcawALosupYAHKyAB5QHv6B1\n2lzlD6uzip1gAaBLAA0BaZFVLY2HmRyuyO98QAP8sADklrnXatzAAJaTAALQHspSTxpKSRzloDJmtJgAJbkgALXdRNYAI3SA\nCBR4xSOWKlsr8mtO1TVgAlwhBsPAABKABUlXih6quACVVwAKvG8VABV0oAKxUh94qVIAJSpAApD0PUACnoQaMYrhSlMABSKo\nqoAFSlAAqSrrQ5VaABKrEAFXdeSgAq6UAFXKRG7FKeACEG1EgAEpTAAUiSKqABUpQAKkq7kOVWgASquABV3XkoAKulABVykU\nuxSngAhBuExR9KACsVIfeKlPACUqQAKQ9D1AAp8oAFSVeKHqq4AJVYgAq8bxUAFXIQae0UgSquABV3XeoAKulABWikUutSng\nBKUwAFIkiqgAUyUACpKu5ElVoACEGq7gAEqsQAVd13qACrpQAVopEbrUp4ASlMABSKoqoAFMlAAqSrsRJVZAAhBiu8EkqsQA\nVdd4qACrpQAVipFbxUp4ASlMABSKoeoAFPlAAqSrrQ9VaAAhBjQGz+A=","Iql/VkvLAAs9dukjLpiACXTEAC7dW6WACmMsAFMVpGt0tZ4AJazwALSMkZYAFnoQCYA=","Iql/ZvHLAAs9dukjLpiACXTEAC7dW6WACmMsAFMVpGt0tZ4AJazwALSMkZYAFnoQCYA=","IqVBbsUqlMAFwABZ4KmtABcAAJiCEAmA","IrtHPdRKVIxlJsZ6kkN5gedEseyqv1hVV7Aqq9jYYbK0mqEAmA==","IsC8P7nKSE+lIegyj9RFgl2c69SrHyhVn5KqyczYWl4w+qEAmA==","IshJRBewWoGn75V9Xsq/LtVeGAMKX6V5qUeyTqN5NlGWmyEAmA==","Isl5RQ5KMJUlFaqSieVJgzQVpXysssJWO24rI7RYTQCld6EAmA==","JJ2TilsMJEpPN6UTCzqINZFDmrzBvDsMClbVUytwp9WxVihAJg==","JKHdjUZsIrYK9uUNq+qFtcFCerzB1JtQmldNRyumo5XQU0hAJg==","Iq1yO1xKYARFLaJ6lhGFgNdsZlyqK7JVId4qk/AYcoo5iqEAmA==","IqWzOvlKX8DVMGAalnCdgEbkVFypu9tVE/SqqPrYe486ySEAmA==","IrRXPDdKXAfVKqSqlMJtgVpsg6SqZ4tVM8WqnOVYamo3m6EAmA==","IpmqACRKqgE1UMC6puCBgEbzrHSln99S+/mpgP2Ye5FFLyEAmA==","IoklPvJKSrIlJ1m6lPz9hhq0tWyquJ1VXFKqqSlYHnq06qEAmA==","IPb8CHrAa9XNUlLD1Clw7RS++Aw5RCMw5VLCAqjhEVRAlIQCYA==","In+zQ/dKMyxlHDayjztlhS/VQxyrzQBV+ogq90NYLT+sBiEAmA==","Io/BPPtKUzaFK3uKlw4hhqYchSSqcGtVODgqlx1YFau31qEAmA==","InoASdfKHKn1EVT6iYp9hIoOGXStjUxW3rCra1bYN3gedqEAmA==","IoQgQSTKQC8lIlfSknwphaV878SrGMhVmnAqyjUYJd0xSKEAmA==","IngoTRjKE+pVC3SChyoNhFfWobSuiWRXVLkrqlyYOn8V4iEAmA==","InxgRunKJ6rlFfVyjGrVhNBFqMyslS9WOpMrME7YMzkloSEAmA==","ItCWT6jJ9dcT4qOnxUpdIdjIa5sF2G5PZpqehSk82iLovUqiXN2WH5J4NNTu6sncU1dIVniy5ntsoJOuridFWU6WuLpyJKXX\nLVtPRJy1iTnLEnFWxdQdrlS5SmlP5N9vybvgE3TALqx1sSXIiMOzJtOWTX80muaBddrvJy8ZfX2CTWdymrbRNN3q/mdIK1eH\n/burJpvWTTe0mg9pf38EUSvBdtyvk035pn38TR/sv+eKTxX/PG2EyaOB00ADJpQNXgvFGsL+/LdYpNKDyaGIU00WLxAGiR1/\nMtvlEmmkRNcJqamTF4zNQYa668hf5NcMia4W02gyrkTV5kXVdMldJuJ9TekSm+n1cptNgS6f7olpOKSicynk5NNrlvJZaXTa\nFplJ0SkTn1InWJ5c0fp0C6PRwtpO8WadssE8VWrnA887XRReptJ6K5T0VynrLBc24lBq6PO5p5PdXKfAvU+tWr1lUKGFQeXW\nqDxFV6w169yEAmA=","Ipk9VFUvuzYr0gjxWAigHomcAAT0TEAAHisC7ABF92Y6hi6qEAAEIBM=","IqPmOu1PRUYAAcQTuGbQ8jUNg7r++S0fa+34JjbfIBwwSCRt47/HmPtfkD8sHc4INKaHplZuIK4996KWAACEAmA=","KDrdSlLUhMA=","FCY0qEw=","FBk3KEw=","FoOKYhM=","FnUTghM=","AiEw","KEP8qrEIhMA=","FBgiSEw=","FAykSEw=","FKsayEw=","FJiyyEw=","KHO3arEIhMA=","KHtRSlDghMA=","JrbpVMTyEw==","JKeyAG6oTA==","IsUxARAhMA==","IMTMA3SEwA==","GOupeITA","IR3aBgyEwA==","IxpZAKWhMA==","JVEq/9ZoTA==","KFuRqSnEuAAH0DA=","KFuRqWhEuAALtHA=","IAEKp4CEwA==","Hf7z4QhM","Hf9b4IhM","E+x7oTA=","HgAC6dIT","H/+iZvoT","Hf9FxWhM","G/6aJSEw","HgAKCsoT","Ht5X17IT","IIhgBV6EwA==","IKB0GoqEwA==","ILOIMpqEwA==","IME+TBaEwA==","IMtoaeqEwA==","HMiWCwhM","HEK9vohM","HqAnosoT","Hb9NvKhM","HyIf1aoT","HTkWBehM","IV+MGgyEwA==","H2CPoToT","IT6oS8SEwA==","IXfCBNyEwA==","ITR0aayEwA==","IUxkMiyEwA==","FgNd+hM=","HgAFm1oT","HgACHYIT","KFtPCS+QhMA="],"background":"#ffffff","elements":[[2,"Scene1",19.2,[[1,"Layer 2",[0.0,3.2],"","",[1],4,[]],[26,"Layer 1",[0.0,3.1],"","",[1],4,[]]]],[9,"",[[2,"1",[0.0,3.2],"",[-0.4461,-0.3709],"",4,[[0,[0.0,0.3],"",[0.0,1.0]],[0,[0.3,2.7],"",[1.0]],[0,[2.7,3.2],"",[1.0,0.0]],[4,[0.0,0.3],"",45],[4,[0.3,2.7],"",45],[4,[2.7,3.2],"",45]]],[8,"2",[0.7,3.2],"",[0.4868,0.1879],"",4,[[0,[0.0,0.3],"",[0.0,1.0]],[0,[0.3,2.0],"",[1.0]],[0,[2.0,2.5],"",[1.0,0.0]],[4,[0.0,0.3],"",51],[4,[0.3,2.0],"",51],[4,[2.0,2.5],"",51]]],[14,"3",[1.4,3.2],"",[0.4868,0.1879],"",4,[[0,[0.0,0.3],"",[0.0,1.0]],[0,[0.3,0.8],"",[1.0]],[0,[0.8,1.3],"",[1.0]],[0,[1.3,1.8],"",[1.0,0.0]],[4,[0.0,0.3],"",56],[4,[0.3,0.8],"",56],[4,[0.8,1.3],"",56],[4,[1.3,1.8],"",56]]],[20,"4",[2.0,3.2],"",[-0.4461,-0.3709],"",4,[[0,[0.0,0.3],"",[0.0,1.0]],[0,[0.3,0.7],"",[1.0]],[0,[0.7,1.2],"",[1.0,0.0]],[4,[0.0,0.3],"",57],[4,[0.3,0.7],"",57],[4,[0.7,1.2],"",57]]]],"",""],[1,"",[[3,"Shape1","","",[8.5233,7.7947],"",4,[[4,[],"",46]]],[4,"Shape2","","",[8.4967,7.8154],"",4,[[4,[],"",47]]],[5,"Shape3","","",[8.9734,7.7062],"",4,[[4,[],"",48]]],[6,"Shape4","","",[8.9154,7.9978],"",4,[[4,[],"",49]]],[7,"Shape5","","",[8.4464,7.3736],"",4,[[4,[],"",50]]]],"",""],[3,"#fbf5e3","","",0],[3,"#564f47","","",1],[3,"#564f47","","",2],[3,"#ead174","","",3],[3,"#e96a75","","",4],[1,"",[[9,"Shape1","","",[5.5619,5.0906],"",4,[[4,[],"",52]]],[10,"Shape2","","",[5.5391,5.1061],"",4,[[4,[],"",53]]],[11,"Shape3","","",[5.8565,5.03],"",4,[[4,[],"",54]]],[12,"Shape4","","",[5.8189,5.2222],"",4,[[4,[],"",55]]],[13,"Shape5","","",[5.5136,4.8159],"",4,[[4,[],"",50]]]],"",""],[3,"#fbf5e3","","",5],[3,"#564f47","","",6],[3,"#564f47","","",7],[3,"#ead174","","",8],[3,"#e96a75","","",9],[1,"",[[15,"Shape1","","",[5.5619,5.0906],"",4,[[4,[],"",52]]],[16,"Shape2","","",[5.5391,5.1061],"",4,[[4,[],"",53]]],[17,"Shape3","","",[5.8565,5.03],"",4,[[4,[],"",54]]],[18,"Shape4","","",[5.8189,5.2222],"",4,[[4,[],"",55]]],[19,"Shape5","","",[5.5136,4.8159],"",4,[[4,[],"",50]]]],"",""],[3,"#fbf5e3","","",5],[3,"#564f47","","",6],[3,"#564f47","","",7],[3,"#ead174","","",8],[3,"#e96a75","","",9],[1,"",[[21,"Shape1","","",[8.5233,7.7947],"",4,[[4,[],"",46]]],[22,"Shape2","","",[8.4967,7.8154],"",4,[[4,[],"",47]]],[23,"Shape3","","",[8.9734,7.7062],"",4,[[4,[],"",48]]],[24,"Shape4","","",[8.9154,7.9978],"",4,[[4,[],"",49]]],[25,"Shape5","","",[8.4464,7.3736],"",4,[[4,[],"",50]]]],"",""],[3,"#fbf5e3","","",0],[3,"#564f47","","",1],[3,"#564f47","","",2],[3,"#ead174","","",3],[3,"#e96a75","","",4],[9,"",[[27,"txt-01.svg",[0.0,3.1],"",[0.301,0.392],"",4,[[4,[0.0,3.1],"",58]]],[35,"fan-01.svg",[0.0,3.1],"",[0.021,0.1678],"",4,[[2,[0.0,3.1],"",[1.54]],[4,[0.0,2.0],"",66],[4,[2.0,3.1],"",67]]],[66,"bg.jpg",[0.0,3.1],"",[375.0,600.0],"",4,[[2,[0.0,3.1],"",[0.504]],[4,[0.0,3.1],"",98]]]],"",""],[1,"",[[28,"Shape1","","",[191.219,30.246],"",4,[[4,[],"",59]]],[29,"Shape2","","",[155.8405,29.905],"",4,[[4,[],"",60]]],[30,"Shape3","","",[130.549,29.802],"",4,[[4,[],"",61]]],[31,"Shape4","","",[107.2445,30.5725],"",4,[[4,[],"",62]]],[32,"Shape5","","",[76.411,30.135],"",4,[[4,[],"",63]]],[33,"Shape6","","",[46.5675,29.691],"",4,[[4,[],"",64]]],[34,"Shape7","","",[15.844,29.0265],"",4,[[4,[],"",65]]]],"",""],[3,"#000000","","",10],[3,"#000000","","",11],[3,"#000000","","",12],[3,"#000000","","",13],[3,"#000000","","",14],[3,"#000000","","",15],[3,"#000000","","",16],[1,"",[[36,"Composite1","","","","",4,[[4,[],"",68]]],[44,"Composite1","","","","",4,[[4,[],"",76]]],[63,"Shape1","","",[41.9935,36.792],"",4,[[4,[],"",95]]],[64,"Shape2","","",[41.981,48.9965],"",4,[[4,[],"",96]]],[65,"Shape3","","",[41.98,20.3928],"",4,[[4,[],"",97]]]],"",""],[1,"",[[37,"Shape1","","",[42.079,65.217],"",4,[[4,[],"",69]]],[38,"Shape2","","",[42.092,65.2135],"",4,[[4,[],"",70]]],[39,"Shape3","","",[42.093,57.52],"",4,[[4,[],"",71]]],[40,"Shape4","","",[42.1135,48.3705],"",4,[[4,[],"",72]]],[41,"Shape5","","",[42.089,44.183],"",4,[[4,[],"",73]]],[42,"Shape6","","",[42.089,52.707],"",4,[[4,[],"",74]]],[43,"Shape7","","",[42.0905,54.274],"",4,[[4,[],"",75]]]],"",""],[3,"#591e25","","",17],[3,"#cf2029","","",18],[3,"#cbac54","","",19],[3,"#cbac54","","",20],[3,"#cf2029","","",21],[3,"#cf2029","","",22],[3,"#6d635c","","",23],[1,"",[[45,"Shape1","","",[56.212,18.503],"",4,[[4,[],"",77]]],[46,"Shape2","","",[59.439,20.4805],"",4,[[4,[],"",78]]],[47,"Shape3","","",[62.521,23.191],"",4,[[4,[],"",79]]],[48,"Shape4","","",[64.9625,26.2715],"",4,[[4,[],"",80]]],[49,"Shape5","","",[66.718,29.533],"",4,[[4,[],"",81]]],[50,"Shape6","","",[68.0185,33.351],"",4,[[4,[],"",82]]],[51,"Shape7","","",[48.401,15.7845],"",4,[[4,[],"",83]]],[52,"Shape8","","",[44.1185,15.173],"",4,[[4,[],"",84]]],[53,"Shape9","","",[52.2315,16.8095],"",4,[[4,[],"",85]]],[54,"Shape10","","",[39.911,15.158],"",4,[[4,[],"",86]]],[55,"Shape11","","",[27.781,18.438],"",4,[[4,[],"",87]]],[56,"Shape12","","",[35.6165,15.7435],"",4,[[4,[],"",88]]],[57,"Shape13","","",[21.4445,23.128],"",4,[[4,[],"",89]]],[58,"Shape14","","",[31.7775,16.7595],"",4,[[4,[],"",90]]],[59,"Shape15","","",[17.234,29.4915],"",4,[[4,[],"",91]]],[60,"Shape16","","",[24.543,20.416],"",4,[[4,[],"",92]]],[61,"Shape17","","",[15.928,33.3195],"",4,[[4,[],"",93]]],[62,"Shape18","","",[18.992,26.216],"",4,[[4,[],"",94]]]],"",""],[3,"#cf2029","","",24],[3,"#cf2029","","",25],[3,"#cf2029","","",26],[3,"#cf2029","","",27],[3,"#cf2029","","",28],[3,"#cf2029","","",29],[3,"#cf2029","","",30],[3,"#cf2029","","",31],[3,"#cf2029","","",32],[3,"#cf2029","","",33],[3,"#cf2029","","",34],[3,"#cf2029","","",35],[3,"#cf2029","","",36],[3,"#cf2029","","",37],[3,"#cf2029","","",38],[3,"#cf2029","","",39],[3,"#cf2029","","",40],[3,"#cf2029","","",41],[3,"#564f47","","",42],[3,"#ed4b5e","","",43],[3,"#ed4b5e","","",44],[8,"assets/images/bg.jpg",[750.0,1200.0]],[2,"$$$LIBRARY$$$",10.0,[]]],"scenes":[0]}};

    var player = anm.createPlayer(WRAPPER_ID, playerParams).load(animation, anm.importers.create('animatron'));

    _.delay(function() {
        $(wrapper).removeClass('invisible');
    }, 100);

    var $loadingscreen = $('#global-loading-screen');
    var loadingEnd = function() {
        $loadingscreen.animate({opacity: 0}, 1500, function() {
            $(this).css({opacity: 1}).addClass('hidden');
            player.stop();
            Amour.LoadingScreenFinished = true;
            Amour.trigger('LoadingScreenFinished');
            /* in render method, check
               if (Amour.LoadingScreenFinished) {
                    do();
               } else {
                    Amour.on('LoadingScreenFinished', do);
               }
            */
        });
    };

    _.delay(function() {
        if (Amour.imagesLoaded) {
            loadingEnd();
        } else {
            Amour.on('ImagesLoaded', loadingEnd);
        }
    }, 5000);
})();
