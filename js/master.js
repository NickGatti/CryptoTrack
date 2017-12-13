$( function () {

    let count = 0
    let data;
    let coin = 'ETH'
    let pullBuysOut = ( passedOrderArray ) => {
        return passedOrderArray.filter( ( ele ) => {
            return ele.side === "buy"
        } )
    }

    let pullSellsOut = ( passedOrderArray ) => {
        return passedOrderArray.filter( ( ele ) => {
            return ele.side === 'sell'
        } )
    }

    let sortLowestToHighest = ( passedOrderArray ) => {
        return passedOrderArray.sort( ( a, b ) => {
            return a.price - b.price
        } )
    }

    let sortHighestToLowest = ( passedOrderArray ) => {
        return passedOrderArray.sort( ( a, b ) => {
            return b.price - a.price
        } )
    }

    var baseUrl = 'https://api.gdax.com//products/ETH-USD/trades';

    var xhr = new XMLHttpRequest()

    xhr.addEventListener( 'load', responseRecieved )

    function getInfo() {
        xhr.open( 'GET', baseUrl )
        xhr.send()
    }

    function responseRecieved() {
        if ( this.status < 200 && this.status >= 400 && this.readyState !== 1 && this.responseText ) {
            console.log( 'Error in API request: ' + this );
            run()
        } else {
            data = this
            run()
        }
        setTimeout( getInfo, 2000 )
    }

    let allRows = []
    let moreRows = []

    function run() {
        let orders = JSON.parse( data.responseText )

        let buyOrders = pullBuysOut( orders )
        sortHighestToLowest( buyOrders )

        let sellOrders = pullSellsOut( orders )
        sortLowestToHighest( sellOrders )

        count += 2

        if ( !buyOrders[ 0 ] || !sellOrders[ 0 ] ) {
            console.log( 'Error in response', sellOrders[ 0 ], buyOrders[ 0 ] );
            return
        }

        if ( allRows.length === 0 ) {
            allRows.push( [ 0, Number( buyOrders[ 0 ].price * 0.9995 ), Number( sellOrders[ 0 ].price * 0.9995 ) ] )
        } else {
            moreRows = [ count, Number( buyOrders[ 0 ].price ), Number( sellOrders[ 0 ].price ) ]
        }


        google.charts.load( 'current', {
            'packages': [ 'line' ]
        } );
        google.charts.setOnLoadCallback( drawChart );

    }

    function drawChart() {
        if ( moreRows.length !== 0 ) allRows.push( moreRows )

        var data = new google.visualization.DataTable();
        data.addColumn( 'number', 'Time in seconds' );
        data.addColumn( 'number', 'Buys' );
        data.addColumn( 'number', 'Sells' );

        data.addRows( allRows );



        var options = {
            chart: {
                title: `USD Price of ${coin} Over Time`,
                subtitle: 'updated every two seconds'
            }
        };

        var chart = new google.charts.Line( document.getElementById( 'chart_div' ) );

        chart.draw( data, google.charts.Line.convertOptions( options ) );
    }

    function landingPage() {
        $( '.page-main' ).empty()
        $( '#backHome' ).css( 'visibility', 'hidden' )
        let mainHead = '<div class="container"><div class="row"><div class="col s12 card z-depth-4"><div class="card z-depth-2"><div class="row"><div class="col s6 center-align"><h3 class="blue-grey-text text-darken-4">CryptoTrack</h3><a class="waves-effect waves-dark btn" id="getStarted">Get Started</a></div><div class="col s6"><img class="responsive-img" src="./images/landing.png" alt=""></div></div></div>'
        let mainFoot = '<ul class="collection with-header z-depth-2"><li class="collection-header"><h5 class="blue-grey-text text-darken-2 ">A website that uses cryptocurrency market exchange APIs to allow people the ability to sort, download and view data</h5></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">Who has this problem:</span> <span class="blue-grey-text text-lighten-2">Anyone interested in Data Science or anyone whos interested in cryptocurrency market information for things like investment.</span></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">How will this project solve this problem:</span> <span class="blue-grey-text text-lighten-2">This will do a lot of the legwork for data science when it comes to getting, sorting and viewing data. It will also help people understand how the market is performing.</span></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">What outputs does it produce:</span> <span class="blue-grey-text text-lighten-2">The website will produce data according to user defined settings.</span></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">What APIs will it use:</span> <span class="blue-grey-text text-lighten-2">Coinbases GDAX API, Google Graph API.</span></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">What technologies do you plan to use:</span> <span class="blue-grey-text text-lighten-2">jQuery</span></li></ul></div></div></div>'
        let fullHTML = mainHead + mainFoot
        $( '.page-main' ).append( fullHTML )
    }

    function flipCoins() {
        coin = $( 'select' ).val()
        baseUrl = `https://api.gdax.com//products/${coin}-USD/trades`
        data = null;
    }

    function initData() {
        $( 'select' ).on( 'change', flipCoins )
    }

    function dataPage() {
        $( '.page-main' ).empty()
        $( '#backHome' ).css( 'visibility', 'visible' )
        let mainHead = '<div class="container"><div class="row"><div class="col s10"><div id="chart_div" class="card"></div></div><div class="col s2"><div class="row">'
        let settingComponents = ''
        settingComponents = '<div class="card col s12"><label>Currency</label><div class="input-field"><select><option value="ETH">ETH</option><option value="BTC">BTC</option></select></div></div>'
        let mainFoot = '</div></div></div></div>'
        let fullHTML = mainHead + settingComponents + mainFoot
        $( '.page-main' ).append( fullHTML )
        $( 'select' ).material_select();
        initData()
        getInfo()
    }

    function init() {
        landingPage()
        $( '#backHome' ).click( function ( e ) {
            e.stopPropagation()
            setTimeout( landingPage, 500 )
        } )
        $( '#getStarted' ).click( function ( e ) {
            e.stopPropagation()
            setTimeout( dataPage, 500 )
        } )
    }

    init()
} );
