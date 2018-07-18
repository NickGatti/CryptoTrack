$( document ).ready( function () {
    $( '.modal' ).modal();
    $( '#modal1' ).modal( 'close' );
} );
$( function () {

    let page = {
        state: 'landingPage'
    }

    let globlChart = {
        state: 'line'
    }

    let storageAva = false

    let sizeSorter = null

    let chartTimeCount = 0
    let dataInXHRRes;

    let zoomData = {
        zoom: 0.99995
    }

    let coin = 'ETH'

    let chartData = {
        'ETH': [],
        'BTC': []
    }

    let allRows = chartData[ coin ]
    let moreRows = []

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

    let sortBySize = ( passedOrderArray ) => {
        return passedOrderArray.filter( ( ele ) => {
            return ele.size > sizeSorter
        } )
    }

    let reduceToDualNumber = ( passedOrderArray ) => {
        return passedOrderArray.map( ( ele ) => {
            return [ ele[ 1 ], ele[ 2 ] ]
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
            dataInXHRRes = this
            run()
        }
        setTimeout( getInfo, 2000 )
    }

    function run() {
        let orders = JSON.parse( dataInXHRRes.responseText )

        let buyOrders = pullBuysOut( orders )
        if ( sizeSorter ) buyOrders = sortBySize( buyOrders )
        sortHighestToLowest( buyOrders )

        let sellOrders = pullSellsOut( orders )
        if ( sizeSorter ) buyOrders = sortBySize( buyOrders )
        sortLowestToHighest( sellOrders )

        if ( !buyOrders[ 0 ] || !sellOrders[ 0 ] ) {
            console.log( 'Error in response', sellOrders[ 0 ], buyOrders[ 0 ] );
            return
        }

        if ( allRows.length === 0 ) {
            allRows.push( [ 0, Number( buyOrders[ 0 ].price * zoomData[ 'zoom' ] ), Number( sellOrders[ 0 ].price * zoomData[ 'zoom' ] ) ] )
        } else {
            chartTimeCount += 2
            moreRows = [ chartTimeCount, Number( buyOrders[ 0 ].price ), Number( sellOrders[ 0 ].price ) ]
        }

        if ( storageAva ) localStorage.setItem( coin, allRows );

        if ( page.state === 'dataPage' && globlChart.state === 'line' ) {
            google.charts.load( 'current', {
                'packages': [ 'line' ]
            } );
            google.charts.setOnLoadCallback( drawLineChart );
        } else if ( page.state === 'dataPage' && globlChart.state === 'scatter' ) {
            google.charts.load( 'current', {
                'packages': [ 'scatter' ]
            } );
            google.charts.setOnLoadCallback( drawScatterChart );
        }
    }

    function drawLineChart() {
        if ( moreRows.length !== 0 ) allRows.push( moreRows )

        var googleData = new google.visualization.DataTable();
        googleData.addColumn( 'number', 'Ticks' );
        googleData.addColumn( 'number', 'Buys' );
        googleData.addColumn( 'number', 'Sells' );

        googleData.addRows( allRows );

        var options = {
            chart: {
                title: `USD Price of ${coin} Over Running Time`,
                subtitle: 'Dollars'
            }
        };

        var chart = new google.charts.Line( document.getElementById( 'chart_div' ) );

        chart.draw( googleData, google.charts.Line.convertOptions( options ) );
    }

    function drawScatterChart() {
        if ( moreRows.length !== 0 ) allRows.push( moreRows )

        var googleData = new google.visualization.DataTable();
        googleData.addColumn( 'number', 'Prices' );
        googleData.addColumn( 'number', 'Prices' );

        let scatterData = reduceToDualNumber( allRows )

        googleData.addRows( scatterData );

        var options = {
            chart: {
                title: 'Buy and Sell Prices',
                subtitle: 'updated every 2 seconds'
            },
            hAxis: {
                title: 'Buys'
            },
            vAxis: {
                title: 'Sells'
            }
        };

        var chart = new google.charts.Scatter( document.getElementById( 'chart_div' ) );

        chart.draw( googleData, google.charts.Scatter.convertOptions( options ) );
    }

    function landingPage() {
        $( '.page-main' ).empty()
        $( '#backHome' ).css( 'visibility', 'hidden' )
        let mainHead = '<div class="container"><div class="row"><div class="col s12 card z-depth-4"><div class="card z-depth-2"><div class="row"><div class="col s6 center-align"><h3 class="blue-grey-text text-darken-4">CryptoTrack</h3><a class="waves-effect waves-dark btn" id="getStarted">Get Started</a></div><div class="col s6"><img class="responsive-img" src="./images/landing.png" alt=""></div></div></div>'
        let mainFoot = '<ul class="collection with-header z-depth-2"><li class="collection-header"><h5 class="blue-grey-text text-darken-2 ">A website that uses cryptocurrency market exchange APIs to allow people the ability to sort, download and view data</h5></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">Who has this problem:</span> <span class="blue-grey-text text-lighten-2">Anyone interested in Data Science or anyone whos interested in cryptocurrency market information for things like investment.</span></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">How will this project solve this problem:</span> <span class="blue-grey-text text-lighten-2">This will do a lot of the legwork for data science when it comes to getting, sorting and viewing data. It will also help people understand how the market is performing.</span></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">What outputs does it produce:</span> <span class="blue-grey-text text-lighten-2">The website will produce data according to user defined settings.</span></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">What APIs will it use:</span> <span class="blue-grey-text text-lighten-2">Coinbases GDAX API, Google Graph API.</span></li><li class="collection-item"> <span class="blue-grey-text text-darken-0">What technologies do you plan to use:</span> <span class="blue-grey-text text-lighten-2">jQuery, Materialize</span></li></ul></div></div></div>'
        let fullHTML = mainHead + mainFoot
        $( '.page-main' ).append( fullHTML )
        $( '#clearStorage' ).css( 'visibility', 'hidden' )
        page.state = 'landingPage'
        $( '#getStarted' ).click( function ( e ) {
            e.stopPropagation()
            setTimeout( dataPage, 500 )
        } )
        $( '#downLoadBtn' ).click( loadDownload )
    }

    function flipCoins() {
        coin = $( '#coinSelect' ).val()
        baseUrl = `https://api.gdax.com//products/${coin}-USD/trades`
        data = null
        moreRows = []
        parseLocalStorage( coin )
    }

    function flipChart() {
        globlChart.state = $( '#chartSelect' ).val()
    }

    function initData() {
        $( '#coinSelect' ).on( 'change', flipCoins )
        $( '#submitSize' ).click( () => {
            if ( $( '#sortSize' ).val() === '' ) {
                sizeSorter = null
            }
            let numSorter = $( '#sortSize' ).val().match( /([^0-9])/gi )
            if ( !numSorter ) sizeSorter = Number( $( '#sortSize' ).val() )

        } )
        $( '#chartSelect' ).on( 'change', flipChart )
    }

    function dataPage() {
        $( '.page-main' ).empty()
        $( '#backHome' ).css( 'visibility', 'visible' )
        let mainHead = '<div class="container"><div class="row"><div class="col s10"><div id="chart_div" class="card"></div></div><div class="col s2"><div class="row">'
        let settingComponents = ''
        settingComponents = '<div class="card col s12"><label>Currency</label><div class="input-field"><select id="coinSelect"><option value="ETH">ETH</option><option value="BTC">BTC</option></select></div></div>'
        settingComponents += '<div class="card col s12"><label>Chart Type</label><div class="input-field"><select id="chartSelect"><option value="line">Line</option><option value="scatter">Scatter</option></select></div></div>'
        settingComponents += '<div class="card col s12"><label>Order Size</label><div class="input-field"><input placeholder="" id="sortSize" type="text" class="validate"></div><a id="submitSize" class="waves-effect waves-light btn">Go</a></div>'

        let mainFoot = '</div></div></div></div>'
        let fullHTML = mainHead + settingComponents + mainFoot
        $( '.page-main' ).append( fullHTML )
        $( 'select' ).material_select();
        $( '#clearStorage' ).css( 'visibility', 'visible' )
        initData()
        getInfo()
        page.state = 'dataPage'
        $( '#backHome' ).click( function ( e ) {
            e.stopPropagation()
            setTimeout( landingPage, 500 )
        } )
    }

    function storageAvailable( type ) {
        try {
            var storage = window[ type ],
                x = '__storage_test__';
            storage.setItem( x, x );
            storage.removeItem( x );
            return true;
        } catch ( e ) {
            return e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ) &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    function parseLocalStorage( inputArray ) {
        let output = []
        let accu = []

        let builder = localStorage.getItem( inputArray )

        if ( !builder ) return

        builder = builder.split( ',' )

        for ( let i = 0; i < builder.length; i++ ) {
            if ( i % 3 === 0 && i >= 3 ) {
                output.push( accu )
                accu = []
            }

            accu.push( Number( builder[ i ] ) )
        }

        builder = output

        builder.sort( ( a, b ) => {
            return a[ 0 ] - b[ 0 ]
        } )

        chartTimeCount = builder[ builder.length - 1 ][ 0 ]
        allRows = builder
    }

    function clearStorage() {
        localStorage.removeItem( coin )
        data = null
        chartTimeCount = 0
        allRows = []
        moreRows = []
    }

    if ( storageAvailable( 'localStorage' ) ) {
        if ( localStorage.getItem( coin ) ) {
            parseLocalStorage( coin )
        } else {
            localStorage.setItem( coin, allRows );
        }
        $( '#clearStorage' ).css( 'visibility', 'visible' )
        $( '#clearStorage' ).click( clearStorage )
        $( '#downloadBtn' ).css( 'visibility', 'visible' )
        storageAva = true
    } else {
        $( '#localStorageModal' ).modal( 'open' );
        $( '#clearStorage' ).css( 'visibility', 'hidden' )
        $( '#downloadBtn' ).css( 'visibility', 'hidden' )
    }

    function loadDownload() {
        // var storedValue = allRows;
        // var linkTag = document.getElementById( 'downloadBtn' );
        // var urlInput = allRows
        // if ( storedValue ) {
        //     urlInput.value = storedValue;
        //     linkTag.href = storedValue;
        //     linkTag.innerHTML = storedValue;
        // }
        console.log( localStorage.getItem( coin ) )
        let downloadOutput = ''
        downloadOutput += '<br><div class="container"><div class="row"><div class="col-12">'
        downloadOutput += `<p>Copy and paste this data into a file onto your computer:</p></p><p class="dataContainer">${localStorage.getItem(coin).toString()}</p>`
        downloadOutput += '</div></div></div><br>'
        $('.page-main').empty().append( downloadOutput )
        $( '.dataContainer' ).css( 'word-wrap', 'break-word' )
    }

    /*

    To make front end download page:
    append a new blank webpage to download and use it as the urlInput

    */

    landingPage()
} );