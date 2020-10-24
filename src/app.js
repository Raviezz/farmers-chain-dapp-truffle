App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        await App.getMyDetails()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]

        console.log(App.account);
    },

    loadContract: async () => {
        // Create a JavaScript version of the smart contract
        const farmers = await $.getJSON('Farmers.json')
        console.log("farmers ", farmers)
        App.contracts.Farmers = TruffleContract(farmers)
        App.contracts.Farmers.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.farmers = await App.contracts.Farmers.deployed()
    },
    render: async () => {
        // Prevent double render
        if (App.loading) {
            return
        }

        // Update app loading state
        App.setLoading(true)
        const userCount = await App.farmers.totUsers()
        const productsCount = await App.farmers.totProducts()
        // Render Account
        $('#usersCount').html(userCount + ' Users');
        $('#productCount').html(productsCount + ' Products')
        $('#account').html(App.account)

        // Render Tasks
        await App.renderProducts()

        // Update loading state
        App.setLoading(false)
    },

    // Get MetaMask Public Key Account details 
    getMyDetails: async () => {
        const userdetails = await App.farmers.getUserDetails(App.account);
        console.log("User Details are ", userdetails);
        $('.utitle').html(userdetails[0])
        $('.upublic').html("Public Key: " + userdetails[1])
        $('.ucnic').html("CNIC " + userdetails[2])
        $('.utype').html("Iam a " + userdetails[3])
        $('.ucity').html("I stay at " + userdetails[4])
    },



    renderProducts: async () => {
        // Load the total task count from the blockchain
        const prodCount = await App.farmers.totProducts()

        // Render out each task with a new task template
        if (prodCount == 0) {
            $('.noProducts').show();
        }
        for (var i = 1; i <= prodCount; i++) {
            // Fetch the task data from the blockchain
            const product = await App.farmers.products(i)
            console.log("details are ", product)
            const pId = product[0].toNumber()
            const productName = product[1]
            const price = product[2].toNumber()
            const harvestedDate = product[3]
            const owner = product[4]
            const recordedDate = product[5]


            // Create the html for the task
            if (owner == App.account) {
                console.log("Product owner  ", pId, productName, harvestedDate, recordedDate, owner, App.account, owner == App.account)

                $("#productsTable > tbody").append(
                    "<tr><td>" + pId + "</td>" +
                    "<td>" + productName + "</td>" +
                    "<td>" + owner + "</td>" +
                    "<td>" + price + "</td>" +
                    "<td>" + harvestedDate + "</td>" +
                    "<td>" + recordedDate + "</td></tr>"
                );

            }

        }
    },

    createUser: async () => {
        App.setLoading(true)
        const fname = $('#fname').val()
        const cnic = $('#cnic').val()
        const city = $('#city').val()
        const owner = $('#faddress').val()
        const utype = $('#userType').val()
        console.log(fname, cnic, city, utype, owner);
        const uuid = await App.farmers.createUser(fname, cnic, city, utype, owner)
        alert(uuid + " is your public key  " + fname + " of user type " + utype + " registered successfully");
        window.location.reload()
    },

    registerProduct: async () => {
        App.setLoading(true)
        const pname = $('#pname').val()
        const price = $('#price').val()
        const harvestDate = $('#harvestDate').val()
        const owner = $('#pOwner').val()

        console.log(pname, price, harvestDate, owner);
        const uuid = await App.farmers.registerProduct(pname, price, harvestDate, owner, new Date().toISOString())
        alert(uuid + " is your product ID  " + pname + " of product , harvested on  " + harvestDate);
        window.location.reload()
    },


    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})