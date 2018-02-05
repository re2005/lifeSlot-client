require('./utils');
const noUiSlider = require('./nouislider.min');
const BigNumber = require('./bignumber.min');
const abi = require('./conf.js');
import Spinner from './spinner';
import Analytics from './analytics';
import '../css/reset.scss';
import '../css/nouislider.min.css';
import '../css/style.scss';
import '../fonts/fonts.css';

class App {

    constructor() {

        this.analytics = new Analytics();

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
            this.spinnerList = undefined;
            this.address = '0x8fd2EAA9ec4BEb9bdaeD12fB2DB3906439DcAF0f';
            this.contract = web3.eth.contract(abi);
            this.ETHBlockByte = this.contract.at(this.address);
            this.step = 1000000000000000;
            this.userAccount = web3.eth.accounts[0];
            this.getAccountInfo();
            this.init(this.address, this.ETHBlockByte);

            this.fee_slider = undefined;
            this.guess_slider = undefined;

        } else {
            document.body.addClassName('no-metamask');
            this.analytics.noMetamask();
        }

        setTimeout(() => {
            this.initSpinner();
        }, 50);

    }


    animateSliders() {

        setInterval(() => {
            this.fee_slider.noUiSlider.set([0.18]);
            this.guess_slider.noUiSlider.set([27, 167]);
        }, 300);
    }


    toggleHowToPlay() {
        const howTo = document.getElementById('how-to-play');
        let hasClassOpen = howTo.className.indexOf('open');
        if (hasClassOpen > 0) {
            howTo.removeClassName('open');
            document.body.removeClassName('open');
            this.analytics.openHowTo();
        } else {
            howTo.addClassName('open');
            document.body.addClassName('open');
            this.analytics.closeHowTo();
            this.animateSliders();
        }
    }

    getAccountInfo() {
        if (!web3.eth.accounts[0]) {
            const interval = setInterval(() => {
                if (web3.eth.accounts[0]) {
                    clearInterval(interval);
                    document.getElementById('error').innerText = '';
                    setInterval(() => {
                        this.updateBalance();
                    }, 2000);
                }
                else {
                    document.getElementById('error').innerText = 'Unlock metamask account';
                }
            }, 5000);
        } else {
            this.updateBalance();
        }
    }

    buildSpinners() {
        this.spinnerList = document.getElementsByClassName('carousel-item');

        for (let spinner = 0; spinner < this.spinnerList.length; spinner++) {
            this.spinnerList[spinner].carousel = new Spinner(this.spinnerList[spinner]);

            this.spinnerList[spinner].carousel.panelCount = 11;
            this.spinnerList[spinner].carousel.modify();
        }
    };

    parseResult(result) {
        let resultArray = ('' + result).split('');
        if (resultArray.length === 3) {
            return resultArray;
        }
        if (resultArray.length === 2) {
            resultArray.unshift(0);
            return resultArray;
        }
        if (resultArray.length === 1) {
            resultArray.unshift(0);
            resultArray.unshift(0);
            return resultArray;
        }
    };

    resetSpinner() {
        this.setStandByOff();
        for (let spinner in this.spinnerList) {
            if (spinner === 'length') {
                return;
            }
            this.spinnerList[spinner].carousel.rotation = 0;
            this.spinnerList[spinner].carousel.transform();
        }
    };

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    };

    spin(key, spinner) {
        this.setStandByOff();
        this.spinnerList[key].carousel.rotation = 0;
        this.spinnerList[key].carousel.transform();
        if (spinner === 0) return;
        let spin = parseInt(spinner) + 12;
        let time = this.getRandomArbitrary(100, 800);

        setTimeout(() => {
            this.spinnerList[key].carousel.rotation += this.spinnerList[key].carousel.theta * spin * -1;
            this.spinnerList[key].carousel.transform();
        }, time);

        setTimeout(() => {
            const spinners = document.getElementsByClassName('spinners');
            spinners[0].removeClassName('spinning-play');
        }, 2000);

    };

    setStandByPlayOn() {
        var spinners = document.getElementsByClassName('spinners');
        spinners[0].addClassName('spinning-play');
        spinners[0].removeClassName('spinning');
    };


    setStandByOn() {
        let spinners = document.getElementsByClassName('spinners');
        spinners[0].addClassName('spinning');
    };

    setStandByOff() {
        var spinners = document.getElementsByClassName('spinners');
        spinners[0].removeClassName('spinning');
    };

    spinFromPlay(result) {
        let parsedResult = this.parseResult(result);

        for (let spinner in this.spinnerList) {
            if (spinner === 'length') {
                return;
            }
            this.spin(spinner, parsedResult[spinner]);
        }
        this.updateBalance();
    };

    initSpinner() {
        this.buildSpinners();
        setTimeout(() => {
            this.setStandByOn();
        }, 1600);
        setTimeout(() => {
            document.body.addClassName('ready');
        }, 0);
    };

    updateBalance() {
        web3.eth.getBalance(web3.eth.accounts[0], (e, r) => {
            document.getElementById('account').innerText = parseFloat(web3.fromWei(r, 'ether')).toFixed(5) + ' ETH';
        });
    };

    data(address, contract) {
        return {
            contract: contract,
            address: address,
            owner: null,
            create_block: 0,
            balance: 0,
            max_fee: 0,
            last_result: null
        };
    };

    init(address, contract) {
        const proxy = new Proxy(this.data(address, contract), {
            set: function (obj, prop, value) {

                obj[prop] = value;
                switch (prop) {
                    case 'balance':
                    case 'max_fee':
                        document.getElementById(prop).innerText = parseFloat(web3.fromWei(value, 'ether')).toFixed(5) + ' ETH';
                        break;

                    case 'last_result':
                        let _value = parseInt(value);
                        document.getElementById(prop).innerText = _value;
                        break;

                    case 'address':
                    case 'owner':
                }
                return true;
            }
        });

        let all_events = proxy.contract.allEvents({fromBlock: 'latest'}, (e, r) => {

            switch (r.event) {
                case 'Play':
                    this.render_play(r);
                    proxy.last_result = parseInt(r.args._result);

                    if (r.args._sender == web3.eth.accounts[0]) {
                        this.spinFromPlay(proxy.last_result);
                    }
                    break;

                case 'Balance':
                    proxy.balance = r.args._balance;
                    proxy.contract.max_fee((e, r) => {
                        proxy.max_fee = r;

                        let max_fee = parseInt(parseInt(r / this.step) * this.step);
                        document.getElementById('fee-slider').noUiSlider.updateOptions({
                            range: {
                                min: this.step,
                                max: max_fee
                            }
                        });
                    });
                    break;

                case 'Destroy':
                    all_events.stopWatching();
                    break;
            }
        });
        this.render(proxy);
        this.collect_data(proxy);
    };

    collect_old_events(data) {
        web3.eth.getBlockNumber((e, r) => {
            let to_block = r;
            data.contract.Play({_sender: [web3.eth.accounts[0]]}, {
                fromBlock: data.create_block,
                toBlock: to_block
            }, (e, r) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.render_play(r);
            });
        });
    };

    collect_data(data) {
        let contract = data.contract;
        web3.eth.getBalance(data.address, function (e, r) {
            data.balance = r;
        });
        contract.owner(function (e, r) {
            data.owner = r;
        });
        contract.max_fee((e, r) => {
            data.max_fee = r;
            this.create_sliders(r);
        });
        contract.create_block((e, r) => {
            data.create_block = r;
            setTimeout(() => {
                this.collect_old_events(data);
            }, 2000);
        });
        contract.last_result(function (e, r) {
            data.last_result = r;
        });
        data.address = data.address;
    };

    time_now() {
        const d = new Date();
        const now = Math.floor(d.getTime() / 1000);
        return now;
    };

    time_ago(timestamp) {
        const seconds = this.time_now() - timestamp;
        if (seconds > 2 * 86400) {
            return Math.floor(seconds / 86400) + ' days ago';
        }
        if (seconds > 86400) {
            return 'yesterday';
        }
        if (seconds > 3600) {
            return Math.floor(seconds / 3600) + ' hours ago';
        }
        if (seconds > 60) {
            return Math.floor(seconds / 60) + ' min ago';
        }
        return 'a few sec ago';
    }

    update_time_ago() {
        let times = document.getElementsByTagName('time');
        for (let i = 0; i < times.length; i++) {
            times[i].innerText = this.time_ago(times[i].dataset.timestamp);
        }
    };

    wait_play(tx) {
        let id = tx;
        const el = document.getElementById(id);
        if (!el) {
            const article = document.getElementById('play');
            let div = document.createElement('a');
            div.id = id;
            div.href = 'https://ropsten.etherscan.io/tx/' + id;
            div.target = '_blank';
            div.className = 'line pending';

            let time = document.createElement('time');
            time.dataset.timestamp = this.time_now();
            let text = document.createTextNode('NOW');
            time.appendChild(text);
            div.appendChild(time);

            text = document.createTextNode('Tx pending, waiting confirmation');
            div.appendChild(text);
            article.prepend(div);
        }
    };

    render_play(play_event) {
        let id = play_event.transactionHash;
        const el = document.getElementById(id);
        if (el) {
            el.parentNode.removeChild(el);
        }
        const article = document.getElementById('play');
        const div = document.createElement('a');
        div.href = 'https://ropsten.etherscan.io/tx/' + id;
        div.target = '_blank';
        div.id = id;

        let time = document.createElement('time');
        time.dataset.timestamp = play_event.args._time;
        let text = document.createTextNode(this.time_ago(play_event.args._time));
        time.appendChild(text);
        div.appendChild(time);
        div.className = 'line';

        if (play_event.args._winner) {
            div.className = 'line winner';
        }

        // let isSenderUser = play_event.args._sender == this.userAccount;
        // if (isSenderUser) {
        //     div.addClassName('user-play');
        // }

        let numbers = document.createElement('span');
        let numbersText = document.createTextNode(parseInt(play_event.args._start) + ' - ' + parseInt(play_event.args._end));
        numbers.appendChild(numbersText);
        div.appendChild(numbers);

        let result = document.createElement('span');
        let resultText = document.createTextNode(parseInt(play_event.args._result));
        result.appendChild(resultText);
        div.appendChild(result);

        let lucky = document.createElement('span');
        lucky.className = 'icon-line';
        div.appendChild(lucky);

        article.prepend(div);

        let section = document.getElementById('section');
        section.classList.remove("loading");

    };

    render(data) {

        let section = document.getElementById('section');
        let article = document.createElement('article');
        article.id = data.address;

        //Error message
        let div = document.createElement('div');
        div.id = 'play-error';
        div.style = 'color: #f00;';
        let text = document.createTextNode('');
        div.appendChild(text);
        article.appendChild(div);


        const playButton = document.getElementById('play-button');
        playButton.addEventListener('click', () => {
            this.play(data);
            this.analytics.openMetamask();
        });

        div = document.createElement('div');
        div.id = 'play';
        article.appendChild(div);
        section.appendChild(article);

        setInterval(() => {
            this.update_time_ago();
        }, 10000);
    };

    create_sliders(max_fee) {
        this.guess_slider = document.getElementById('guess-slider');
        noUiSlider.create(this.guess_slider, {
            start: [40, 210],
            step: 1,
            behaviour: 'drag',
            connect: [true, true, true],
            tooltips: true,
            range: {
                'min': 1,
                'max': 255
            },
            format: {
                to: function (value) {
                    return parseInt(value);
                },
                from: function (value) {
                    return parseInt(value);
                }
            }
        });

        let connect = this.guess_slider.querySelectorAll('.noUi-connect');
        connect[0].classList.add('color-gray-2');
        connect[1].classList.add('color-red');
        connect[2].classList.add('color-gray-2');
        this.guess_slider.noUiSlider.on('set', () => {
            this.calculate_prize();
        });

        max_fee = parseInt(parseInt(max_fee / this.step) * this.step);
        this.fee_slider = document.getElementById('fee-slider');
        noUiSlider.create(this.fee_slider, {
            start: 0.1,
            step: this.step,
            connect: [true, false],
            tooltips: true,
            range: {
                'min': this.step,
                'max': max_fee
            },
            format: {
                to: function (value) {
                    return parseFloat(web3.fromWei(value, 'ether')).toFixed(3) + ' ETH';
                },
                from: function (value) {
                    return web3.toWei(value.replace(' ETH', ''), 'ether');
                }
            }
        });

        connect = this.fee_slider.querySelectorAll('.noUi-connect');
        connect[0].classList.add('color-red');
        this.fee_slider.noUiSlider.on('set', () => {
            this.calculate_prize();
        });
        this.calculate_prize();
    };


    calculate_prize() {
        let guess_slider = document.getElementById('guess-slider').noUiSlider.get();
        let start = guess_slider[0];
        let end = guess_slider[1];
        let fee = web3.toWei(document.getElementById('fee-slider').noUiSlider.get().replace(' ETH', ''), 'ether');
        fee = new BigNumber(fee);

        let range = end - start + 1;
        let percentage = 100 - parseInt(range * 100 / 255);
        let prize = 0;
        if (percentage > 10) {
            prize = fee.times(percentage - 10).div(100);
        }
        let credit = fee.plus(prize);

        fee = parseFloat(web3.fromWei(fee, 'ether')).toFixed(3) + ' ETH';
        credit = parseFloat(web3.fromWei(credit, 'ether')).toFixed(3) + ' ETH';

        let buttonFee = document.getElementById('play-button-fee');
        let buttonWin = document.getElementById('play-button-win');
        buttonFee.innerText = fee;
        buttonWin.innerText = credit;
    };

    play(data) {
        if (!web3.eth.accounts[0]) {
            document.getElementById('play-error').innerText = 'Please unlock MetaMask';
            this.analytics.noMetamaskAccount();
            return;
        }
        document.getElementById('play-error').innerText = '';
        const guess_slider = document.getElementById('guess-slider').noUiSlider.get();
        let start = ('0' + guess_slider[0].toString(16)).slice(-2);
        let end = ('0' + guess_slider[1].toString(16)).slice(-2);
        let fee = web3.toWei(document.getElementById('fee-slider').noUiSlider.get().replace(' ETH', ''), 'ether');
        if (start.length == 2 && start.match(/[0-9a-f]{2}/) &&
            end.length == 2 && end.match(/[0-9a-f]{2}/) &&
            fee.length > 0 && fee.match(/[0-9]+/)) {
            start = "0x" + start;
            end = "0x" + end;
            fee = new BigNumber(fee);
            data.contract.play(start, end, {from: web3.eth.accounts[0], value: fee}, (e, r) => {
                if (e) {
                    document.getElementById('play-error').innerText = 'Transaction was NOT completed, try again.';
                    console.log(e.message);
                    this.analytics.errorMetamask();
                }
                if (r) {
                    this.wait_play(r);
                    console.log('play tx ' + r);
                    this.setStandByPlayOn();
                    this.analytics.playSuccess();
                }
            });
        }
        else {
            document.getElementById('play-error').innerText = 'enter start and end bytes';
        }
    };
}


window.addEventListener('DOMContentLoaded', function () {
    window.app = new App();
}, false);
