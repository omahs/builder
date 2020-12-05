import { createSelector } from 'reselect'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isEqual } from 'lib/address'
import { RootState } from 'modules/common/types'
import { getPendingTransactions } from 'modules/transaction/selectors'
import { getName } from 'modules/profile/selectors'
import { SET_ENS_RESOLVER_SUCCESS, SET_ENS_CONTENT_REQUEST, SET_ENS_CONTENT_SUCCESS } from './actions'
import { ENS } from './types'
import { ENSState } from './reducer'
import { getDomainFromName } from './utils'

export const getState = (state: RootState) => state.ens
export const getData = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const getENSList = createSelector<RootState, ENSState['data'], ENS[]>(getData, ensData => Object.values(ensData))

export const getENSByWallet = createSelector<RootState, ENS[], string | undefined, ENS[]>(getENSList, getAddress, (ensList, address = '') =>
  ensList.filter(ens => isEqual(ens.address, address))
)

export const getAliases = createSelector<RootState, ENS[], string | undefined, string | null, ENS[]>(
  getENSList,
  getAddress,
  getName,
  (ensList, address = '', name = '') =>
    ensList.filter(ens => isEqual(ens.address, address) && name && ens.subdomain === getDomainFromName(name))
)

export const getENSForLand = (state: RootState, landId: string) => {
  const ensList = getENSList(state)
  return ensList.filter(ens => ens.landId === landId)
}

export const isWaitingTxSetResolver = createSelector<RootState, Transaction[], boolean>(getPendingTransactions, transactions =>
  transactions.some(transaction => SET_ENS_RESOLVER_SUCCESS === transaction.actionType)
)

export const isWaitingTxSetLandContent = (state: RootState, landId: string) =>
  getPendingTransactions(state).some(
    transaction => SET_ENS_CONTENT_SUCCESS === transaction.actionType && transaction.payload.land.id === landId
  )

export const isLoadingContentBySubdomain = createSelector<RootState, ENS[], LoadingState, Record<string, boolean>>(
  getENSList,
  getLoading,
  (ensList, loading) =>
    ensList.reduce(
      (obj, ens) => ({
        ...obj,
        [ens.subdomain]: loading.some(action => action.type === SET_ENS_CONTENT_REQUEST && action.payload.ens.subdomain === ens.subdomain)
      }),
      {} as Record<string, boolean>
    )
)

export const isPendingContentBySubdomain = createSelector<RootState, ENS[], Transaction[], Record<string, boolean>>(
  getENSList,
  getPendingTransactions,
  (ensList, transactions) =>
    ensList.reduce(
      (obj, ens) => ({
        ...obj,
        [ens.subdomain]: transactions.some(
          transaction => SET_ENS_CONTENT_SUCCESS === transaction.actionType && transaction.payload.ens.subdomain === ens.subdomain
        )
      }),
      {} as Record<string, boolean>
    )
)