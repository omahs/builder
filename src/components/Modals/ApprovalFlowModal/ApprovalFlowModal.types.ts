import { Dispatch } from 'redux'
import { MerkleDistributorInfo } from '@dcl/content-hash-tree/dist/types'
import { DeploymentPreparationData } from 'dcl-catalyst-client'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { approveCollectionRequest, ApproveCollectionRequestAction } from 'modules/collection/actions'
import { Collection } from 'modules/collection/types'
import { rescueItemsRequest, RescueItemsRequestAction } from 'modules/item/actions'
import { Item } from 'modules/item/types'
import { deployEntitiesRequest, DeployEntitiesRequestAction } from 'modules/entity/actions'
import {
  deployBatchedThirdPartyItemsRequest,
  DeployBatchedThirdPartyItemsRequestAction,
  reviewThirdPartyRequest,
  ReviewThirdPartyRequestAction
} from 'modules/thirdParty/actions'
import { Slot } from 'modules/thirdParty/types'
import { ThirdPartyError } from 'modules/collection/utils'

export enum ApprovalFlowModalView {
  LOADING = 'loading',
  RESCUE = 'rescue',
  CONSUME_TP_SLOTS = 'consume_tp_slots',
  DEPLOY = 'deploy',
  DEPLOY_TP = 'deploy_third_party',
  DEPLOYING_TP = 'deploying_third_party',
  APPROVE = 'approve',
  SUCCESS = 'success',
  ERROR = 'error'
}

export type ApprovalFlowModalMetadata<V extends ApprovalFlowModalView = ApprovalFlowModalView> = {
  view: V
  collection: Collection
} & (V extends ApprovalFlowModalView.RESCUE
  ? { items: Item[]; contentHashes: string[] }
  : V extends ApprovalFlowModalView.DEPLOY
  ? { items: Item[]; entities: DeploymentPreparationData[] }
  : V extends ApprovalFlowModalView.CONSUME_TP_SLOTS
  ? { slots: Slot[]; merkleTreeRoot: MerkleDistributorInfo['merkleRoot']; items: Item[] }
  : V extends ApprovalFlowModalView.DEPLOY_TP
  ? { items: Item[]; collection: Collection; tree: MerkleDistributorInfo; hashes: Record<string, string> }
  : V extends ApprovalFlowModalView.ERROR
  ? { error: string }
  : Record<string, unknown>)

export type Props = ModalProps & {
  onRescueItems: typeof rescueItemsRequest
  onDeployItems: typeof deployEntitiesRequest
  onDeployThirdPartyItems: typeof deployBatchedThirdPartyItemsRequest
  onApproveCollection: typeof approveCollectionRequest
  onReviewThirdParty: typeof reviewThirdPartyRequest
  isConfirmingRescueTx: boolean
  isConfirmingReviewThirdPartyTx: boolean
  isDeployingItems: boolean
  isConfirmingApproveTx: boolean
  isAwaitingApproveTx: boolean
  TPDeployItemsProgress: number
  errors: ThirdPartyError[]
}

export type State = {
  didRescue: boolean
  didApproveConsumeSlots: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'isConfirmingRescueTx'
  | 'isConfirmingReviewThirdPartyTx'
  | 'isDeployingItems'
  | 'isAwaitingApproveTx'
  | 'isConfirmingApproveTx'
  | 'TPDeployItemsProgress'
  | 'errors'
>
export type MapDispatchProps = Pick<
  Props,
  'onRescueItems' | 'onDeployItems' | 'onApproveCollection' | 'onReviewThirdParty' | 'onDeployThirdPartyItems'
>
export type MapDispatch = Dispatch<
  | RescueItemsRequestAction
  | DeployEntitiesRequestAction
  | ApproveCollectionRequestAction
  | ReviewThirdPartyRequestAction
  | DeployBatchedThirdPartyItemsRequestAction
>
