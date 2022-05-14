import Logger from 'Logger';
import CreativeAnalyzer from 'CreativeAnalyzer';
import PlacementStorage from 'PlacementStorage';

/**
 * Creative Manager
 * @class CreativeManager
 */
class CreativeManager {
  constructor({ publisherId }) {
    this.initialze(publisherId);
  }

  async initialze(publisherId) {
    this.publisher = (await this.fetch(`${publisherId}`)).publisher;
    // I dont know if publisherId is different from this.publisher.id =)
    this.creatives = (await this.fetch(`${this.publisher.id}/creatives/`)).creatives;
  }

  /**
   * asynchronous fetch method
   * @param {string} apiUrl 
   * @returns {object} from response.json()
   */
  async fetch(apiUrl) {
    const response = await fetch(`/api/publishers/${apiUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    return data;
  }

  /**
   * send logs
   * @param {object} creative
   */
  sendLogs({ id, name, adType, size, price, placementId}) {
    new Logger().send('Creative rendered', {
      creative_id: id,
      creative_name: name,
      creative_type: adType,
      creative_size: size,
      creative_price: price,
      creative_placement: placementId,
    });
  }

  run() {
    for (const creative of this.creatives) {
      const {
        adType,
        id,
        name,
        price,
        placementId,
        html,
        takeoverId,
        takeoverParams,
        hybrid,
      } = creative;
      const { verticalHtml, horizontalHtml, vertical, horizontal, takeover } = hybrid;
      const notAllowedTakeovers = [2233, 45435, 2352, 6683];

      this.sendLogs({id, name, adType, size, price, placementId});
      
      CreativeAnalyzer.run({ id, name, type: adType, price });

      if ((adType === 'takeover' || takeover) && notAllowedTakeovers.indexOf(takeoverId) === -1) {
        this.renderTakeover(
          PlacementStorage.find(placementId, takeoverParams)
        );
      }

      if (adType === 'hybrid') {
        // assuming vertical & horizontal are ?.string
        const config = {
          [vertical]: verticalHtml,
          [horizontal]: horizontalHtml,
        };

        this.render(
          PlacementStorage.find(placementId),
          config[vertical || horizontal]
        );
      }

      // default simple
      this.render(
        PlacementStorage.find(placementId),
        html
      );
    }
  }

  render(placementId, htmlStr) {
    const placement = document.getElementById(placementId);

    placement.innerHTML = htmlStr;
  }

  renderTakeover(placementId, params) {
    // renders creative in a specific way
  }
}

// Usage:

const creativeManager = new CreativeManager({
  publisherId: 1,
});

// ....

creativeManager.run();
