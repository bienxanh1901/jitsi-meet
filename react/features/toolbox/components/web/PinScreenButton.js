// @flow
import {
    createToolbarEvent,
    sendAnalytics
} from '../../../analytics';
import { translate } from '../../../base/i18n';
import { IconPin } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';
import {isLocalParticipantModerator } from '../../../base/participants';
import { setFollowMe } from '../../../base/conference';

type Props = AbstractButtonProps & {

  /**
   * Whether or not "follow me" enabled
   */
   _pinScreen: boolean,

   /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Implementation of a button for toggling fullscreen state.
 */
class PinScreenButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.pinScreen';
    icon = IconPin;
    label = 'toolbar.enablePinScreen';
    toggledLabel = 'toolbar.disablePinScreen';

    /**
     * Retrieves icon dynamically.
     */
    get tooltip() {
        if (this._isToggled()) {
            return 'toolbar.disablePinScreen';
        }

        return 'toolbar.enablePinScreen';
    }

    /**
     * Required by linter due to AbstractButton overwritten prop being writable.
     *
     * @param {string} _value - The value.
     */
    set tooltip(_value) {
        // Unused.
    }

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {

        if (this.props.handleClick) {
            handleClick();
            return;
        }

        const enable = !this.props._pinScreen;
        sendAnalytics(createToolbarEvent('follow.me', { enable }));
        this.props.dispatch(setFollowMe(enable));
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._pinScreen;
    }
}

/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @param {Props} ownProps - The component's own props.
 * @returns {Object}
 */
 function _mapStateToProps(state: Object, ownProps: Props) {
    const { followMeEnabled } = state['features/base/conference'];
    const { visible = isLocalParticipantModerator(state) } = ownProps;
    return {
        _pinScreen: followMeEnabled,
        visible
    };
};

export default translate(connect(_mapStateToProps)(PinScreenButton));
