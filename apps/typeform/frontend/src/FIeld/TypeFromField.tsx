import React, { useEffect, useReducer } from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Select, Option, TextLink, Note, Tooltip } from '@contentful/forma-36-react-components';
import { TypeFormResponse, FormOption, InstallationParameters } from '../interfaces';
import { styles } from './styles';
// @ts-ignore 2307
import logo from './typeform-icon.svg';

interface Props {
  sdk: FieldExtensionSDK;
}

enum ACTION_TYPES {
  INIT = 'INIT',
  UPDATE_VALUE = 'UPDATE_VALUE',
  RESET = 'RESET'
}

const initialState = {
  value: '',
  selectedForm: {
    name: '',
    href: '',
    isPublic: true,
    id: ''
  } as FormOption,
  hasStaleData: false,
  forms: [] as FormOption[],
  loading: true
};

const isStaleData = (value: string, forms: FormOption[]): boolean => {
  if (!value || forms.length === 0) {
    return false;
  }
  // If the currrent value was found in the fetched forms
  // we do not have stale data
  return !forms.find(form => form.href === value);
};

const getSelectedForm = (value: string, forms: FormOption[]) => {
  return forms.find(form => form.href === value) || initialState.selectedForm;
};

export function TypeFormField({ sdk }: Props) {
  const { workspaceId, accessToken } = sdk.parameters.installation as InstallationParameters;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, forms, value, hasStaleData, selectedForm } = state;

  function reducer(
    state = initialState,
    action: { type: string; payload?: any }
  ): typeof initialState {
    switch (action.type) {
      case ACTION_TYPES.INIT: {
        const { forms } = action.payload;
        const currentFieldValue = sdk.field.getValue();
        const hasStaleData = isStaleData(currentFieldValue, forms);
        return {
          ...state,
          value: currentFieldValue,
          selectedForm: getSelectedForm(currentFieldValue, forms),
          loading: false,
          forms,
          hasStaleData
        };
      }
      case ACTION_TYPES.UPDATE_VALUE: {
        const { value, forms } = action.payload;
        let selectedForm = initialState.selectedForm;
        if (value) {
          sdk.field.setValue(value);
          selectedForm = (forms as FormOption[]).find(form => form.href === value)!;
        } else {
          selectedForm = initialState.selectedForm;
          sdk.field.removeValue();
        }
        return { ...state, value, selectedForm, hasStaleData: false };
      }
      case ACTION_TYPES.RESET: {
        sdk.field.removeValue();
        return {
          ...state,
          value: '',
          hasStaleData: false,
          selectedForm: initialState.selectedForm
        };
      }
      default:
        return state;
    }
  }

  useEffect(() => {
    const fetchForms = async () => {
      const response = (await (
        await fetch('http://localhost:3000/forms')
      ).json()) as TypeFormResponse;

      const normalizedForms = normalizeFormResponse(response);
      dispatch({
        type: ACTION_TYPES.INIT,
        payload: {
          forms: normalizedForms
        }
      });
    };
    fetchForms();
  }, []);

  const onChange = (event: any) => {
    const value = event.currentTarget.value;
    dispatch({ type: ACTION_TYPES.UPDATE_VALUE, payload: { value, forms } });
  };

  const openDialog = async () => {
    await sdk.dialogs.openCurrentApp({
      width: 1000,
      parameters: {
        value
      },
      title: 'Form Preview',
      shouldCloseOnEscapePress: true,
      shouldCloseOnOverlayClick: true
    });
  };

  const normalizeFormResponse = (typeFormResponse: TypeFormResponse): FormOption[] => {
    return typeFormResponse.forms.items.map(form => ({
      name: form.title,
      href: form._links.display,
      id: form.id,
      isPublic: form.settings.is_public
    }));
  };

  if (loading) {
    return null;
  }

  const PreviewButton = (
    <TextLink onClick={openDialog} disabled={!selectedForm.isPublic}>
      Preview
    </TextLink>
  );

  return (
    <React.Fragment>
      <div className={styles.field}>
        <img src={logo} />
        <Select onChange={onChange} value={value}>
          <Option key="" value="">
            {forms.length === 0 ? 'No forms available' : 'Choose typeform'}
          </Option>
          {forms.map(form => (
            <Option key={form.id} value={form.href}>
              {form.name}
            </Option>
          ))}
        </Select>
      </div>
      {value && !hasStaleData && (
        <div className={styles.actionButtons}>
          {selectedForm.isPublic ? (
            PreviewButton
          ) : (
            <Tooltip
              containerElement="span"
              content="You can not preview this form because it is private"
              place="right">
              {PreviewButton}
            </Tooltip>
          )}
          <TextLink
            href={`https://admin.typeform.com/form/${selectedForm.id}/create`}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!value}>
            Edit
          </TextLink>
        </div>
      )}
      {hasStaleData && (
        <Note>
          The form you have selected in Contentful no longer exists in Typeform.{' '}
          <TextLink onClick={() => dispatch({ type: ACTION_TYPES.RESET })}>Clear</TextLink>
        </Note>
      )}
    </React.Fragment>
  );
}