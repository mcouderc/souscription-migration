import type { UserInformation } from 'open-api-souscription-typescript';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface IUserInformationSate {
  user: UserInformation;
}

export const useUserInformationStore = defineStore('user', () => {
  const emptyUser: IUserInformationSate = {
    user: {
      email: '',
      paysIa: '',
      typeEncaissement: '',
      codeIa: '',
      name: '',
      role: ''
    }
  };
  const state = ref<IUserInformationSate>(emptyUser);

  const user = computed(() => {
    return state.value.user;
  });

  const setUser = (user: UserInformation) => {
    state.value.user = user;
  };

  const deleteUser = () => {
    state.value.user = emptyUser.user;
  };

  return {
    user,
    setUser,
    deleteUser
  };
});
