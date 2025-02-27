import * as React from 'react'
import classNames from 'classnames'

import { getBackgroundStyle, getThumbnailURL } from 'modules/item/utils'
import RarityBadge from 'components/RarityBadge'
import ItemBadge from 'components/ItemBadge'
import { SmartBadge } from 'components/SmartBadge'
import { ItemMetadataType } from 'modules/item/types'
import { getItemMetadataType } from 'modules/item/utils'
import { Props } from './ItemImage.types'
import './ItemImage.css'

export default class ItemImage extends React.PureComponent<Props> {
  static defaultProps = {
    className: '',
    hasBadge: false,
    hasRarityBackground: true
  }

  render() {
    const { className, item, src, hasBadge, badgeSize, hasRarityBadge, hasRarityBackground } = this.props
    const isSmart = getItemMetadataType(item) === ItemMetadataType.SMART_WEARABLE

    return (
      <div
        className={classNames('ItemImage', 'is-image', 'image-wrapper', className)}
        style={hasRarityBackground ? getBackgroundStyle(item.rarity) : { backgroundColor: 'var(--dark-two)' }}
      >
        <img className="item-image" src={src || getThumbnailURL(item)} alt={item.name} />
        <div className="badges-container">
          {hasRarityBadge && item.rarity && item.data.category ? (
            <RarityBadge className="rarity-badge" category={item.data.category} rarity={item.rarity} />
          ) : null}
          {hasBadge ? (
            <>
              <ItemBadge item={item} size={badgeSize}></ItemBadge>
              {isSmart ? <SmartBadge size={badgeSize} /> : null}
            </>
          ) : null}
        </div>
      </div>
    )
  }
}
