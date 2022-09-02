package daos

import (
	"errors"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/models"
)

// ExternalAuthQuery returns a new ExternalAuth select query.
func (dao *Dao) ExternalAuthQuery() *dbx.SelectQuery {
	return dao.ModelQuery(&models.ExternalAuth{})
}

/// FindAllExternalAuthsByUserId returns all ExternalAuth models
/// linked to the provided userId.
func (dao *Dao) FindAllExternalAuthsByUserId(userId string) ([]*models.ExternalAuth, error) {
	auths := []*models.ExternalAuth{}

	err := dao.ExternalAuthQuery().
		AndWhere(dbx.HashExp{"userId": userId}).
		OrderBy("created ASC").
		All(&auths)

	if err != nil {
		return nil, err
	}

	return auths, nil
}

// FindExternalAuthByProvider returns the first available
// ExternalAuth model for the specified provider and providerId.
func (dao *Dao) FindExternalAuthByProvider(provider, providerId string) (*models.ExternalAuth, error) {
	model := &models.ExternalAuth{}

	err := dao.ExternalAuthQuery().
		AndWhere(dbx.HashExp{
			"provider":   provider,
			"providerId": providerId,
		}).
		Limit(1).
		One(model)

	if err != nil {
		return nil, err
	}

	return model, nil
}

// FindExternalAuthByUserIdAndProvider returns the first available
// ExternalAuth model for the specified userId and provider.
func (dao *Dao) FindExternalAuthByUserIdAndProvider(userId, provider string) (*models.ExternalAuth, error) {
	model := &models.ExternalAuth{}

	err := dao.ExternalAuthQuery().
		AndWhere(dbx.HashExp{
			"userId":   userId,
			"provider": provider,
		}).
		Limit(1).
		One(model)

	if err != nil {
		return nil, err
	}

	return model, nil
}

// SaveExternalAuth upserts the provided ExternalAuth model.
func (dao *Dao) SaveExternalAuth(model *models.ExternalAuth) error {
	return dao.Save(model)
}

// DeleteExternalAuth deletes the provided ExternalAuth model.
//
// The delete may fail if the linked user doesn't have an email and
// there are no other linked ExternalAuth models available.
func (dao *Dao) DeleteExternalAuth(model *models.ExternalAuth) error {
	user, err := dao.FindUserById(model.UserId)
	if err != nil {
		return err
	}

	if user.Email == "" {
		allExternalAuths, err := dao.FindAllExternalAuthsByUserId(user.Id)
		if err != nil {
			return err
		}

		if len(allExternalAuths) <= 1 {
			return errors.New("You cannot delete the only available external auth relation because the user doesn't have an email set.")
		}
	}

	return dao.Delete(model)
}
