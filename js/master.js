$( function () {
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
    xhr.open( 'GET', baseUrl )
    xhr.send()

    function responseRecieved() {
        if ( this.status < 200 && this.status >= 400 && this.readyState !== 1 ) {
            console.log( 'Error in API request: ' + this );
            return
        }
        run( JSON.parse( this.responseText ) )
    }

    function run( orders ) {
        let buyOrders = pullBuysOut( orders )
        sortHighestToLowest( buyOrders )

        let sellOrders = pullSellsOut( orders )
        sortLowestToHighest( sellOrders )

        console.log( buyOrders );
        console.log( sellOrders );
    }
} );