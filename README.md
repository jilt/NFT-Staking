<<<<<<< HEAD
=======
This marketplace is published under MIT license, so you can clone an use it as you like, here are the instructions to run it and the info about the Varda project.
If you need help setting up the project consider (buying my NFTs here)[https://paras.id/jilt.near/creation] to get a free setup of the marketplace on your favourite hosting.

Quick Start
===========

To run this project locally:

1. Prerequisites: Make sure you've installed [Node.js] ≥ 12
2. Install dependencies: `yarn install`
3. Run the local development server: `yarn dev` (see `package.json` for a
   full list of `scripts` you can run with `yarn`)

Now you'll have a local development environment backed by the NEAR TestNet!

Go ahead and play with the app and the code. As you make code changes, the app will automatically reload.


Exploring The Code
==================

1. The "backend" code lives in the `/contract` folder. See the README there for
   more info.
2. The frontend code lives in the `/src` folder. `/src/index.html` is a great
   place to start exploring. Note that it loads in `/src/index.js`, where you
   can learn how the frontend connects to the NEAR blockchain.
3. Tests: there are different kinds of tests for the frontend and the smart
   contract. See `contract/README` for info about how it's tested. The frontend
   code gets tested with [jest]. You can run both of these at once with `yarn
   run test`.


Deploy
======

Every smart contract in NEAR has its [own associated account][NEAR accounts]. When you run `yarn dev`, your smart contract gets deployed to the live NEAR TestNet with a throwaway account. When you're ready to make it permanent, here's how.


Step 0: Install near-cli (optional)
-------------------------------------

[near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain. It was installed to the local `node_modules` folder when you ran `yarn install`, but for best ergonomics you may want to install it globally:

    yarn install --global near-cli

Or, if you'd rather use the locally-installed version, you can prefix all `near` commands with `npx`

Ensure that it's installed with `near --version` (or `npx near --version`)


Step 1: Create an account for the contract
------------------------------------------

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your contract to `nft-mint-frontend.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `nft-mint-frontend.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

      near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

      near create-account nft-mint-frontend.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet


Step 2: set contract name in code
---------------------------------

Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'nft-mint-frontend.YOUR-NAME.testnet'


Step 3: deploy!
---------------

One command:

    yarn deploy

As you can see in `package.json`, this does two things:

1. builds & deploys smart contract to NEAR TestNet
2. builds & deploys frontend code to GitHub using [gh-pages]. This will only work if the project already has a repository set up on GitHub. Feel free to modify the `deploy` script in `package.json` to deploy elsewhere.

Step 4: initialize
------------------
One command:

`near call $CONTRACT_NAME new_default_meta '{"owner_id": "'$CONTRACT_NAME'"}' --accountId $CONTRACT_NAME`


Troubleshooting
===============

On Windows, if you're seeing an error containing `EPERM` it may be related to spaces in your path. Please see [this issue](https://github.com/zkat/npx/issues/209) for more details.


  [React]: https://reactjs.org/
  [create-near-app]: https://github.com/near/create-near-app
  [Node.js]: https://nodejs.org/en/download/package-manager/
  [jest]: https://jestjs.io/
  [NEAR accounts]: https://docs.near.org/docs/concepts/account
  [NEAR Wallet]: https://wallet.testnet.near.org/
  [near-cli]: https://github.com/near/near-cli
  [gh-pages]: https://github.com/tschaub/gh-pages

>>>>>>> 4f7a76af9674e39c244036d8c80c7beeee5f9bca
# Varda NFT market implementation

Using the PoC backbone for NFT Marketplaces on NEAR Protocol.

[Reference](https://nomicon.io/Standards/NonFungibleToken/README.html)

## ToDo:
- [ ] add stNEAR as a trading ft
- [ ] implement [Narwallet](https://narwallets.github.io/meta-pool/) with Varda Vault NEARNFT dispay for unlockable content

## Varda strategy game and staking mechanics explained

[![Varda strategy game and staking mechanics explained](https://img.youtube.com/vi/xM8EhLeGOEI/0.jpg)](https://www.youtube.com/watch?v=xM8EhLeGOEI)

## Varda cultural reference

[![Varda cultural reference](https://img.youtube.com/vi/6rOkVq8qPrs/0.jpg)](https://www.youtube.com/watch?v=6rOkVq8qPrs)

[Varda Tokenomics](https://varda-vision.medium.com/)

## Progress:
- [x] basic purchase of NFT with FT
- [x] demo pay out royalties (FTs and NEAR)
- [x] test and determine standards for markets (best practice?) to buy/sell NFTs (finish standard) with FTs (already standard)
- [x] demo some basic auction types, secondary markets and 
- [x] frontend example
- [x] first pass / internal audit
- [ ] connect with bridged tokens e.g. buy and sell with wETH/nDAI (or whatever we call these)
- [ ] add ability to migrate NFT to ethereum blockchain using rainbowbridge/aurora

## Notes:

High level diagram of NFT sale on Market using Fungible Token:
![image](https://user-images.githubusercontent.com/321340/113903355-bea71e80-9785-11eb-8ab3-9c2f0d23466f.png)

Remove the FT steps for NEAR transfers (but nft_transfer_payout and resolve_purchase still the same).

Differences from `nft-simple` NFT standard reference implementation:
- anyone can mint an NFT
- Optional token_type
- capped supply by token_type
- lock transfers by token_token
- enumerable.rs

## Working

**Frontend App Demo: `/test/app.test.js/`**
- install, deploy, test `yarn && yarn test:deploy`
- run app - `yarn start`

**App Tests: `/test/app.test.js/`**
- install, deploy, test `yarn && yarn test:deploy`
- if you update contracts - `yarn test:deploy`
- if you update tests only - `yarn test`

# NFT Specific Notes

Associated Video Demos (most recent at top)

[![NEAR Protocol - Demo NFT Marketplace Walkthough](https://img.youtube.com/vi/AevmMAtkIr4/0.jpg)](https://www.youtube.com/watch?v=AevmMAtkIr4)

[![Live App Review 19 - NFT Marketplace with Fungible Token Transfers and Royalty Distribution](https://img.youtube.com/vi/sGTC3rs8OJQ/0.jpg)](https://youtu.be/sGTC3rs8OJQ)

Some additional ideas around user onboarding:

[![NEAR Protocol - NFT Launcher & Easy User Onboarding Demo - Hackathon Starter Kit!](https://img.youtube.com/vi/59Lzt1PFF6I/0.jpg)](https://www.youtube.com/watch?v=59Lzt1PFF6I)

# Detailed Installation / Quickstart

#### If you don't have Rust
Install Rust https://rustup.rs/
#### If you have never used near-cli
1. Install near-cli: `npm i -g near-cli`
2. Create testnet account: [Wallet](https://wallet.testnet.near.org)
3. Login: `near login`
#### Installing and Running Tests for this Example
1. Install everything: `yarn && (cd server && yarn)`
2. Deploy the contract and run the app tests: `yarn test:deploy`
3. (WIP) Start server and run server tests: `cd server && yarn start` then in another terminal from the root `yarn test:server`

#### Notes
- If you ONLY change the JS tests use `yarn test`.
- If you change the contract run `yarn test:deploy` again.
- If you run out of funds in the dev account run `yarn test:deploy` again.
- If you change the dev account (yarn test:deploy) the server should restart automatically, but you may need to restart the app and sign out/in again with NEAR Wallet.
### Moar Context

There's 3 main areas to explore:
- frontend app - shows how to create guest accounts that are added to the app contract via the nodejs server. Guests can mind NFTs, put them up for sale and earn NEAR tokens. When the guest has NEAR they can upgrade their account to a full account.
- app.test.js (demos frontend only tests)

### Owner Account, Token Account, etc...

The tests are set up to auto generate the dev account each time you run `test:deploy` **e.g. you will get a new NFT contract address each time you run a test**.

This is just for testing. You can obviously deploy a token to a fixed address on testnet / mainnet, it's an easy config update.

#### Guests Account (key and tx gas sponsorship)
When you run app / server tests. There's a contract deployed and a special account created `guests.OWNER_ACCOUNT_ID` to manage the sponsored users (the ones you will pay for gas fees while onboarding). This special "guests" account is different from the test guest account `bob.TOKEN_ID.OWNER_ACCOUNT_ID`. It is an account, different from the owner or token accounts, that manages the guests keys.

#### Guest Accounts
The guest users can `claim_drop, ft_transfer_guest` and receive tokens from other users, e.g. in the server tests the owner transfers tokens to the guest account via API call and using client side code.

Then, following the server tests, the guest transfers tokens to alice (who is a real NEAR account e.g. she pays her own gas).

Finally, the guest upgrades themselves to a real NEAR account, something demoed in the video.

It's a lot to digest but if you focus on the `/test/app.test.js` you will start to see the patterns.
# Background

One of the issues with onboarding new users to crypto is that they need to have crypto to do anything e.g. mint an NFT. A creator, artist or community might want to drop a bunch of free minting options to their fans for them to mint user generated content, but the audience has (1) no crypto to pay for fees (2) no wallet (3) no concept of crypto or blockchain; prior to the drop. 

So let's solve these issues by allowing users to generate content the traditional Web2 way!

We do a demo of creating a "guest" named account for an app where the gas fees are sponsored by a special app account called "guests.APP_NAME.near". The guest account doesn't exist (sometimes called a virtual or contract account) until the user creates and sells and NFT that generates some NEAR tokens and then they can upgrade to a real account. Until then their name is reserved because only the app is able to create "USERNAME.APP_NAME.near".

This has many advantages for user onboarding, where users can use the app immediately and later can be upgraded to a full account. The users also don't have to move any assets - namely the fungible tokens they earned as a guest user. 

## Installation

Beyond having npm and node (latest versions), you should have Rust installed. I recommend nightly because living on the edge is fun.

https://rustup.rs/

Also recommend installing near-cli globally

`npm i -g near-cli`

Everything else can be installed via:
`yarn`
`cd server && yarn`

## NEAR Config

There is only one config.js file found in `src/config.js`, this is also used for running tests.

Using `src/config.js` you can set up your different environments. Use `REACT_APP_ENV` to switch environments e.g. in `package.json` script `deploy`.

## Running Tests

You can run unit tests in the Rust contracts themselves, but it may be more useful to JS tests against testnet itself.

Note: to run the app and server tests make sure you install and start the server.
- cd server
- yarn && yarn start

Commands:
- `test` will simply run app tests against the contract already deployed. You can mess around with `app.test.js` and try different frontend stuff
- `test:deploy` - will deploy a new dev account (`/neardev`) and deploy a new contract to this account, then run `test`
- `test:server` - will test the server, make sure you start it (see "Note" above)
- `test:unit` - runs the rust unit tests

If you've changed your contract or your dev account has run out of funds use `test:deploy`, if you're updating your JS tests only then use `test`.

## Test Utils

There are helpers in `test/test-utils.js` that take care of:
1. creating a near connection and establishing a keystore for the dev account
2. creating test accounts each time a test is run
3. establishing a contract instance so you can call methods

You can change the default funding amount for test accounts in `src/config.js`

## Using the NEAR Config in your app

In `src/state/near.js` you will see that `src/config.js` is loaded as a function. This is to satisfy the jest/node test runner.

You can destructure any properies of the config easily in any module you import it in like this:

```
// example file app.js

import getConfig from '../config';
export const {
	GAS,
	networkId, nodeUrl, walletUrl, nameSuffix,
	contractName,
} = getConfig();
```
Note the export const in the destructuring?

Now you can import these like so:
```
//example file Component.js
import { GAS } from '../app.js'
...
await contract.withdraw({ amount: parseNearAmount('1') }, GAS)
...
```

# React 17, Parcel with useContext and useReducer
- Bundled with Parcel 2.0 (@next) && eslint
- *Minimal all-in-one state management with async/await support*

## Getting Started: State Store & useContext

>The following steps describe how to use `src/utils/state` to create and use your own `store` and `StateProvider`.

1. Create a file e.g. `/state/app.js` and add the following code
```js
import { State } from '../utils/state';

// example
const initialState = {
	app: {
		mounted: false
	}
};

export const { store, Provider } = State(initialState);
```
2. Now in your `index.js` wrap your `App` component with the `StateProvider`
```js
import { Provider } from './state/app';

ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById('root')
);
```
3. Finally in `App.js` you can `useContext(store)`
```js
const { state, dispatch, update } = useContext(store);
```

## Usage in Components
### Print out state values
```js
<p>Hello {state.foo && state.foo.bar.hello}</p>
```
### Update state directly in component functions
```js
const handleClick = () => {
    update('clicked', !state.clicked);
};
```
### Dispatch a state update function (action listener)
```js
const onMount = () => {
    dispatch(onAppMount('world'));
};
useEffect(onMount, []);
```
## Dispatched Functions with context (update, getState, dispatch)

When a function is called using dispatch, it expects arguments passed in to the outer function and the inner function returned to be async with the following json args: `{ update, getState, dispatch }`

Example of a call:
```js
dispatch(onAppMount('world'));
```

All dispatched methods **and** update calls are async and can be awaited. It also doesn't matter what file/module the functions are in, since the json args provide all the context needed for updates to state.

For example:
```js
import { helloWorld } from './hello';

export const onAppMount = (message) => async ({ update, getState, dispatch }) => {
	update('app', { mounted: true });
	update('clicked', false);
	update('data', { mounted: true });
	await update('', { data: { mounted: false } });

	console.log('getState', getState());

	update('foo.bar', { hello: true });
	update('foo.bar', { hello: false, goodbye: true });
	update('foo', { bar: { hello: true, goodbye: false } });
	update('foo.bar.goodbye', true);

	await new Promise((resolve) => setTimeout(() => {
		console.log('getState', getState());
		resolve();
	}, 2000));

	dispatch(helloWorld(message));
};
```
## Prefixing store and Provider

The default names the `State` factory method returns are `store` and `Provider`. However, if you want multiple stores and provider contexts you can pass an additional `prefix` argument to disambiguate.

```js
export const { appStore, AppProvider } = State(initialState, 'app');
```

## Performance and memo

The updating of a single store, even several levels down, is quite quick. If you're worried about components re-rendering, use `memo`:
```js
import React, { memo } from 'react';

const HelloMessage = memo(({ message }) => {
	console.log('rendered message');
	return <p>Hello { message }</p>;
});

export default HelloMessage;
```
Higher up the component hierarchy you might have:
```js
const App = () => {
	const { state, dispatch, update } = useContext(appStore);
    ...
	const handleClick = () => {
		update('clicked', !state.clicked);
	};

	return (
		<div className="root">
			<HelloMessage message={state.foo && state.foo.bar.hello} />
			<p>clicked: {JSON.stringify(state.clicked)}</p>
			<button onClick={handleClick}>Click Me</button>
		</div>
	);
};
```
When the button is clicked, the component HelloMessage will not re-render, it's value has been memoized (cached). Using this method you can easily prevent performance intensive state updates in further down components until they are neccessary.

Reference:
- https://reactjs.org/docs/context.html
- https://dmitripavlutin.com/use-react-memo-wisely/
