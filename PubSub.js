class PubSub {

  constructor() {
    this.channels = {};
  }
  /**
   * subscribe to any events (channels);
   * @param {string} channel
   * @param {Function} cb
   * @returns {string} returns unique id per channel for the subscriber
   */
  subscriber(channel, cb) {
    const id = (new Date().getTime()).toString(36);

    this.channels[channel] = this.channels[channel] || {};
    this.channels[channel][id] = cb;

    // return token for unsubscribing
    return id;
  }

  /**
   * unsubscribe from any events (channels)
   * @param {string} channel 
   * @param {string} id 
   */
  unsubscribe(channel, id) {
   if (this.channels[channel][id]) {
      delete this.channels[channel][id];

      console.log(`Unsubscribing ${channel}`);
   }
  }

  /**
   * call every subscribed listener with data on publishing the event (channel)
   * @param {string} channel 
   * @param {any} data 
   */
  publish(channel, data) {
    if (this.channels[channel]) {
      const [key] = Object.keys(this.channels[channel]);

      if(this.channels[channel][key]) {
        this.channels[channel][key](data);
      } else {
        console.warn(`Unable to publish ${channel}`);
      }
    }
  }
}

const mouth = new PubSub();
const shoutToken = mouth.subscriber('shout', (e) => console.log('shouting ', e))
const whisperToken = mouth.subscriber('whisper', (e) => console.log('whispering', e))

mouth.publish('shout', 'pubSub!!!');
mouth.publish('whisper', 'pubSub...');
mouth.unsubscribe('whisper', whisperToken);
mouth.publish('whisper', 'whuutt');