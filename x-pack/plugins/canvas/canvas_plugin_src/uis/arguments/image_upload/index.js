/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EuiSpacer, EuiButtonGroup } from '@elastic/eui';
import { AssetPicker } from '../../../../public/components/asset_picker';
import { elasticOutline } from '../../../lib/elastic_outline';
import { resolveFromArgs } from '../../../../common/lib/resolve_dataurl';
import { isValidHttpUrl } from '../../../../common/lib/httpurl';
import { encode } from '../../../../common/lib/dataurl';
import { templateFromReactComponent } from '../../../../public/lib/template_from_react_component';
import './image_upload.scss';
import { FileForm, LinkForm } from './forms';

class ImageUpload extends React.Component {
  static propTypes = {
    onAssetAdd: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    typeInstance: PropTypes.object.isRequired,
    resolvedArgValue: PropTypes.string,
    assets: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const url = props.resolvedArgValue || null;

    let urlType = Object.keys(props.assets).length ? 'asset' : 'file';
    // if not a valid base64 string, will show as missing asset icon
    if (isValidHttpUrl(url)) urlType = 'link';

    this.inputRefs = {};

    this.state = {
      loading: false,
      url, // what to show in preview / paste url text input
      urlType, // what panel to show, fileupload or paste url
    };
  }

  componentDidMount() {
    // keep track of whether or not the component is mounted, to prevent rogue setState calls
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateAST = assetId => {
    this.props.onValueChange({
      type: 'expression',
      chain: [
        {
          type: 'function',
          function: 'asset',
          arguments: {
            _: [assetId],
          },
        },
      ],
    });
  };

  handleUpload = files => {
    const { onAssetAdd } = this.props;
    const [upload] = files;
    this.setState({ loading: true }); // start loading indicator

    encode(upload)
      .then(dataurl => onAssetAdd('dataurl', dataurl))
      .then(assetId => {
        this.updateAST(assetId);

        // this component can go away when onValueChange is called, check for _isMounted
        this._isMounted && this.setState({ loading: false }); // set loading state back to false
      });
  };

  changeUrlType = optionId => {
    this.setState({ urlType: optionId });
  };

  setSrcUrl = () => {
    const { value: srcUrl } = this.inputRefs.srcUrlText;
    this.setState({ url: srcUrl });

    const { onValueChange } = this.props;
    onValueChange(srcUrl);
  };

  render() {
    const { loading, url, urlType } = this.state;
    const assets = Object.values(this.props.assets);

    let selectedAsset = {};

    const urlTypeOptions = [{ id: 'file', label: 'Import' }, { id: 'link', label: 'Link' }];
    if (assets.length) {
      urlTypeOptions.unshift({ id: 'asset', label: 'Asset' });
      selectedAsset = assets.find(({ value }) => value === url) || {};
    }

    const selectUrlType = (
      <EuiButtonGroup
        buttonSize="s"
        options={urlTypeOptions}
        idSelected={urlType}
        onChange={this.changeUrlType}
        isFullWidth
      />
    );

    const forms = {
      file: <FileForm loading={loading} onUpload={this.handleUpload} />,
      link: (
        <LinkForm
          url={url}
          inputRef={ref => (this.inputRefs.srcUrlText = ref)}
          onSubmit={this.setSrcUrl}
        />
      ),
      asset: (
        <AssetPicker
          assets={assets}
          selected={selectedAsset.id}
          onChange={({ id }) => this.updateAST(id)}
        />
      ),
    };

    return (
      <div className="canvasSidebar__panel-noMinWidth" style={{ position: 'relative' }}>
        {selectUrlType}
        <EuiSpacer size="s" />
        {forms[urlType]}
        <EuiSpacer size="s" />
      </div>
    );
  }
}

export const imageUpload = () => ({
  name: 'imageUpload',
  displayName: 'Image upload',
  help: 'Select or upload an image',
  resolveArgValue: true,
  template: templateFromReactComponent(ImageUpload),
  resolve({ args }) {
    return { dataurl: resolveFromArgs(args, elasticOutline) };
  },
});
