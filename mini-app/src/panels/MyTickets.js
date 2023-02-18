import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, PanelHeaderBack, FormItem, Input } from '@vkontakte/vkui';

const MyTicket = props => (
	<Panel id={props.id}>
		<PanelHeader
			before={<PanelHeaderBack onClick={props.go} data-to="home"/>}
		>
		</PanelHeader>

	</Panel>
);

MyTicket.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default MyTicket;
